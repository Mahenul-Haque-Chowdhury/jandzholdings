import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Set initial value without triggering synchronous state update warning if possible
    // Wait, the error is specifically for calling setState synchronously in the body of an effect.
    // The standard way to fix this in useMediaQuery hooks is to set it initially during state initialization 
    // but in Next.js SSR window is not defined. 
    // We can just rely on the first change event and maybe a setTimeout or just let the initial effect pass.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    // Call it async
    let raf = requestAnimationFrame(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT))
    
    return () => {
      cancelAnimationFrame(raf)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
