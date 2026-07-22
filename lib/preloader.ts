type PreloaderWindow = Window & {
  __preloaderActive?: boolean;
  __preloaderDone?: boolean;
};

export function isPreloaderReady() {
  if (typeof window === "undefined") {
    return false;
  }

  const preloaderState = window as PreloaderWindow;
  return (
    preloaderState.__preloaderDone === true ||
    preloaderState.__preloaderActive === false ||
    preloaderState.__preloaderActive === undefined
  );
}

export function subscribePreloaderDone(callback: () => void) {
  window.addEventListener("preloader:done", callback);
  return () => window.removeEventListener("preloader:done", callback);
}