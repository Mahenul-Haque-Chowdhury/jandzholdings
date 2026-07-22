"use client";

import { useEffect, useRef, useState } from "react";
import { requestScrollRefresh, onceLayoutSettled } from "@/lib/scrollRefresh";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

gsap.registerPlugin(ScrollTrigger);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hasWebGLSupport() {
  if (typeof document === "undefined") {
    return true;
  }

  try {
    const testCanvas = document.createElement("canvas");
    return !!(testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const stats = [
  {
    value: "2021",
    label: "established as a limited company in Bangladesh.",
    side: "left",
  },
  {
    value: "2,30,000+",
    label: "sft under development at Crown Palace, Cumilla.",
    side: "right",
  },
  {
    value: "80",
    label: "apartments planned across two residential towers.",
    side: "left",
  },
  {
    value: "100%",
    label: "commitment to sustainable, affordable delivery.",
    side: "right",
  },
] as const;

export default function Stats3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current) {
      return;
    }

    const sectionEl = sectionRef.current;
    const canvasEl = canvasRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & {
      connection?: {
        saveData?: boolean;
      };
      deviceMemory?: number;
    };
    const isLowPower =
      nav.connection?.saveData || (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4);
    const dprCap = prefersReducedMotion ? 1 : isLowPower ? 1.25 : 1.8;

    if (!hasWebGLSupport()) {
      const frameId = window.requestAnimationFrame(() => setStatus("error"));
      return () => window.cancelAnimationFrame(frameId);
    }

    let disposed = false;
    let initialized = false;
    let cleanup: (() => void) | null = null;

    const initScene = () => {
      if (initialized || disposed || !canvasEl.isConnected) {
        return;
      }
      initialized = true;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xdde8f5);
      scene.fog = new THREE.FogExp2(0xdde8f5, 0.0018);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
      renderer.setSize(canvasEl.clientWidth, canvasEl.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      let hdriTexture: THREE.DataTexture | null = null;
      let hdriEnvironment: THREE.Texture | null = null;

      const sky = new THREE.Mesh(
        new THREE.SphereGeometry(1200, 32, 32),
        new THREE.ShaderMaterial({
          side: THREE.BackSide,
          depthWrite: false,
          uniforms: {
            topColor: { value: new THREE.Color(0x77b8ff) },
            bottomColor: { value: new THREE.Color(0xdde8f5) },
          },
          vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            varying vec3 vWorldPosition;
            void main() {
              float h = normalize(vWorldPosition).y;
              gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
            }
          `,
        }),
      );
      sky.frustumCulled = false;
      scene.add(sky);

      new HDRLoader()
        .setPath("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/")
        .load(
          "kloppenheim_06_puresky_1k.hdr",
          (texture) => {
            if (disposed) {
              texture.dispose();
              return;
            }

            texture.mapping = THREE.EquirectangularReflectionMapping;
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            hdriTexture = texture;
            hdriEnvironment = envMap;
            scene.background = texture;
            scene.environment = envMap;
            sky.visible = false;
          },
          undefined,
          () => {
            sky.visible = true;
          },
        );

      const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 5000);
      scene.add(camera);

      scene.add(new THREE.AmbientLight(0xffffff, 0.42));

      const keyLight = new THREE.DirectionalLight(0xfff3df, 1.7);
      keyLight.position.set(6, 10, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xcce8ff, 0.24);
      fillLight.position.set(-10, 8, -6);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.36);
      rimLight.position.set(0, 7, -11);
      scene.add(rimLight);

      const frontLight = new THREE.PointLight(0xfff4df, 0.12, 80);
      frontLight.position.set(0, 5, 8);
      scene.add(frontLight);

      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      const target = new THREE.Vector3();
      const windowTarget = new THREE.Vector3();
      const modelSize = new THREE.Vector3(1, 1, 1);
      let orbitRadius = 10;
      let verticalLift = 2.6;
      let closeDistance = 1;
      let modelReady = false;

      const cameraState = {
        currentAngle: -0.85,
        currentHeight: 0,
        currentRadius: 12,
        currentLookAt: new THREE.Vector3(),
        targetLookAt: new THREE.Vector3(),
        currentFov: 38,
        targetFov: 38,
        targetAngle: -0.85,
        targetHeight: 0,
        targetRadius: 12,
      };

      const frameModel = () => {
        const box = new THREE.Box3().setFromObject(modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        box.getSize(modelSize);

        modelGroup.position.set(-center.x - modelSize.x * 0.02, -center.y, -center.z);
        target.set(0, modelSize.y * 0.36, 0);

        const maxAxis = Math.max(modelSize.x, modelSize.y, modelSize.z);
        orbitRadius = maxAxis * (window.innerWidth < 768 ? 2.05 : window.innerWidth < 1280 ? 1.72 : 1.55);
        verticalLift = modelSize.y * 0.42;
        closeDistance = Math.max(maxAxis * 0.12, 0.75);
        windowTarget.set(modelSize.x * 0.42, modelSize.y * 0.22, -modelSize.z * 0.08);
        cameraState.currentRadius = orbitRadius;
        cameraState.targetRadius = orbitRadius;
        cameraState.currentHeight = target.y + verticalLift;
        cameraState.targetHeight = target.y + verticalLift;
        cameraState.currentLookAt.copy(target);
        cameraState.targetLookAt.copy(target);
      };

      const updateSize = () => {
        const width = canvasEl.clientWidth || window.innerWidth;
        const height = canvasEl.clientHeight || window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
      };

      const updateScrollTargets = (rawProgress: number) => {
        const progress = clamp((rawProgress - 0.12) / 0.88, 0, 1);
        const travel = THREE.MathUtils.smoothstep(progress, 0, 1);
        const rise = Math.sin(travel * Math.PI);
        const startAngle = -1.35;
        const endAngle = 1.6;
        const zoomFactor = 0.55;
        const startRadius = orbitRadius * 1.08;
        const endRadius = modelSize.x * 0.42 + closeDistance;
        const softenedEndRadius = startRadius - (startRadius - endRadius) * zoomFactor;
        const startHeight = target.y + verticalLift;
        const endHeight = windowTarget.y + modelSize.y * 0.015;

        cameraState.targetAngle = THREE.MathUtils.lerp(startAngle, endAngle, travel);
        cameraState.targetRadius = THREE.MathUtils.lerp(startRadius, softenedEndRadius, travel);
        cameraState.targetHeight = THREE.MathUtils.lerp(startHeight, endHeight, travel) + rise * modelSize.y * 0.08;
        cameraState.targetLookAt.copy(target).lerp(windowTarget, travel);
        cameraState.targetFov = THREE.MathUtils.lerp(38, 38 - (38 - 33) * zoomFactor, travel);
        sectionEl.style.setProperty("--stats-3d-progress", `${progress}`);
      };

      const render = () => {
        cameraState.currentAngle = THREE.MathUtils.lerp(cameraState.currentAngle, cameraState.targetAngle, 0.075);
        cameraState.currentRadius = THREE.MathUtils.lerp(cameraState.currentRadius, cameraState.targetRadius, 0.075);
        cameraState.currentHeight = THREE.MathUtils.lerp(cameraState.currentHeight, cameraState.targetHeight, 0.075);
        cameraState.currentLookAt.lerp(cameraState.targetLookAt, 0.075);
        cameraState.currentFov = THREE.MathUtils.lerp(cameraState.currentFov, cameraState.targetFov, 0.075);

        if (Math.abs(camera.fov - cameraState.currentFov) > 0.01) {
          camera.fov = cameraState.currentFov;
          camera.updateProjectionMatrix();
        }

        if (modelReady) {
          const angle = cameraState.currentAngle;
          camera.position.set(
            Math.cos(angle) * cameraState.currentRadius,
            cameraState.currentHeight,
            Math.sin(angle) * cameraState.currentRadius,
          );
          camera.lookAt(cameraState.currentLookAt);
        }

        renderer.render(scene, camera);
      };

      let scrollTrigger: ScrollTrigger | null = null;

      const handleResize = () => {
        updateSize();

        if (modelReady) {
          frameModel();
          updateScrollTargets(scrollTrigger?.progress ?? 0);
        }
      };

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.load(
        "/3d/hospital_tower_model_web.glb",
        (gltf) => {
          if (disposed) {
            return;
          }

          const model = gltf.scene;
          model.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) {
              return;
            }

            child.castShadow = true;
            child.receiveShadow = true;

            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (!material) return;
              material.envMapIntensity = 0.65;

              // The sign texture ("ttt" material, "marinahotel" image) is
              // mirrored in the source model — flip it horizontally so the
              // text reads correctly instead of re-exporting the asset.
              if (material.name === "ttt" && material.map) {
                material.map.wrapS = THREE.RepeatWrapping;
                material.map.repeat.x = -1;
                material.map.needsUpdate = true;
              }

              material.needsUpdate = true;
            });
          });

          modelGroup.add(model);
          frameModel();
          updateSize();
          updateScrollTargets(scrollTrigger?.progress ?? 0);
          modelReady = true;
          setStatus("ready");
          requestScrollRefresh();
        },
        undefined,
        () => {
          if (!disposed) {
            setStatus("error");
          }
        },
      );

      updateSize();
      updateScrollTargets(0);
      renderer.setAnimationLoop(render);

      const handleVisibilityChange = () => {
        renderer.setAnimationLoop(document.hidden ? null : render);
      };

      // ScrollTrigger's own pin implementation (a spacer element under the
      // hood) handles mobile address-bar resize and momentum-scroll
      // correctly — the previous approach (manual getBoundingClientRect
      // reads driving a React-state fixed/absolute class toggle) fought
      // those same browser quirks and was the source of the pin jittering
      // or misaligning on mobile.
      const createTrigger = () => {
        scrollTrigger?.kill();
        scrollTrigger = ScrollTrigger.create({
          trigger: sectionEl,
          start: "top top",
          end: "bottom bottom",
          pin: canvasEl.parentElement,
          pinSpacing: false,
          onUpdate: (self) => updateScrollTargets(self.progress),
        });
      };

      createTrigger();
      const stopWaitingForLayout = onceLayoutSettled(createTrigger);

      window.addEventListener("resize", handleResize);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const textureKeys = [
        "map",
        "normalMap",
        "roughnessMap",
        "metalnessMap",
        "aoMap",
        "emissiveMap",
        "envMap",
        "lightMap",
        "alphaMap",
        "bumpMap",
        "displacementMap",
        "clearcoatMap",
        "clearcoatNormalMap",
        "clearcoatRoughnessMap",
        "sheenColorMap",
        "sheenRoughnessMap",
        "specularMap",
        "specularIntensityMap",
        "specularColorMap",
        "transmissionMap",
        "thicknessMap",
      ] as const;

      const disposeMaterial = (material: THREE.Material) => {
        const materialWithTextures = material as THREE.Material &
          Partial<Record<(typeof textureKeys)[number], THREE.Texture | null | undefined>>;

        textureKeys.forEach((key) => {
          const texture = materialWithTextures[key];
          if (texture) {
            texture.dispose();
          }
        });
        material.dispose();
      };

      cleanup = () => {
        disposed = true;
        renderer.setAnimationLoop(null);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        stopWaitingForLayout();
        scrollTrigger?.kill();
        dracoLoader.dispose();
        hdriTexture?.dispose();
        hdriEnvironment?.dispose();
        pmremGenerator.dispose();
        renderer.dispose();
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) {
            return;
          }

          object.geometry.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => disposeMaterial(material));
            return;
          }

          disposeMaterial(object.material);
        });
      };
    };

    // Init well before the section arrives and during an idle frame, so the
    // heavy WebGL setup never blocks an in-progress scroll.
    let idleId: number | null = null;

    const scheduleInit = () => {
      const idleWindow = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(initScene, { timeout: 1500 });
      } else {
        idleId = window.setTimeout(initScene, 200);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }
        observer.disconnect();
        scheduleInit();
      },
      { rootMargin: "150% 0px" },
    );

    observer.observe(sectionEl);

    return () => {
      disposed = true;
      observer.disconnect();
      if (idleId !== null) {
        const idleWindow = window as Window & { cancelIdleCallback?: (id: number) => void };
        if (idleWindow.cancelIdleCallback) {
          idleWindow.cancelIdleCallback(idleId);
        } else {
          window.clearTimeout(idleId);
        }
      }
      cleanup?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[140vh] overflow-clip border-y border-white/10 bg-[linear-gradient(180deg,#0b0f12_0%,#161c20_100%)] md:h-[160vh] lg:h-[180vh]"
    >
      <div className="relative z-0 h-svh overflow-hidden will-change-transform">
        <canvas ref={canvasRef} className="h-full w-full" aria-label="A cinematic 3D skyscraper view" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,16,20,0.05),rgba(12,16,20,0.4))]" />

        <div className="absolute inset-0 mx-auto flex h-full max-w-7xl flex-col px-5 pb-6 pt-8 sm:px-6 sm:pb-10 sm:pt-12 md:px-12 md:pb-16 md:pt-14 lg:px-16">
          <div className="mb-4 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.32em] text-white/60 sm:mb-8 sm:gap-4 sm:text-sm md:mb-12 md:text-base lg:-ml-20 xl:-ml-24 2xl:-ml-28">
            <span className="h-px w-8 bg-white/20 sm:w-12" />
            <span>Performance in numbers</span>
          </div>

          <div className="grid flex-1 grid-cols-2 content-center gap-x-4 gap-y-5 text-white sm:grid-cols-1 sm:content-start sm:gap-8 md:pt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,920px)_minmax(0,1fr)] md:gap-x-32 md:gap-y-28 lg:pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1040px)_minmax(0,1fr)] lg:gap-x-36 lg:gap-y-32">
            {stats.map((item) => (
              <div
                key={item.value}
                className={`max-w-xs ${
                  item.side === "left"
                    ? "text-left md:col-start-1 md:justify-self-start md:-ml-6 lg:-ml-10"
                    : "text-left sm:text-left md:col-start-3 md:justify-self-end md:text-right"
                }`}
                style={{
                  opacity: "calc(var(--stats-3d-progress, 0) * 1)",
                  transform: "translateY(calc((1 - var(--stats-3d-progress, 0)) * 28px))",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
              >
                <div className="text-[clamp(1.9rem,8vw,6rem)] font-light leading-[0.9] tracking-[-0.04em] drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                  {item.value}
                </div>
                <p className="mt-2 text-[0.65rem] uppercase leading-snug tracking-[0.1em] text-white/70 sm:mt-5 sm:text-sm sm:tracking-[0.16em] md:text-[13px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 hidden items-end justify-between text-xs uppercase tracking-[0.3em] text-white/55 sm:flex sm:mt-8 md:mt-12">
            <span>{status === "error" ? "3D scene unavailable" : status === "ready" ? "" : "Loading 3D scene"}</span>
          </div>
        </div>

        {status === "error" ? (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,14,0.85),rgba(10,12,14,0.96))]" />
        ) : null}
      </div>
    </section>
  );
}
