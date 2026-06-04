import * as React from "react";

/**
 * Returns true when the viewport width is below the given max-width breakpoint.
 * Generic helper — does not hardcode any single page's behaviour.
 */
export function useBelowBreakpoint(maxWidth: number) {
  const [below, setBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth - 1}px)`);
    const onChange = () => setBelow(window.innerWidth < maxWidth);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, [maxWidth]);

  return !!below;
}
