import { useEffect, useState } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop" | "xl" | "2xl";

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      if (width < 640) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else if (width < 1440) {
        setBreakpoint("desktop");
      } else if (width < 1536) {
        setBreakpoint("xl"); // 1440 - 1535
      } else {
        setBreakpoint("2xl"); // >= 1536
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
