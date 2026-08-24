/**
 * Pointer-proximity spring physics for the animated nav dock, adapted from
 * ThreeUI's AnimatedTopDock reference (topDockController.ts). The spring/
 * damping/smoothstep math is kept exactly as authored; only the DOM
 * bookkeeping is adjusted for real <Link> navigation instead of a demo's
 * local button state.
 */
export type NavDockOptions = {
  proximity: number;
  spring: number;
  damping: number;
  widthGrowth: number;
  heightGrowth: number;
  drop: number;
};

type DockItemState = {
  element: HTMLElement;
  baseWidth: number;
  baseHeight: number;
  value: number;
  velocity: number;
  target: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function createNavDockController(root: HTMLElement, getOptions: () => NavDockOptions) {
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const precisionQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const items: DockItemState[] = Array.from(root.querySelectorAll<HTMLElement>("[data-dock-item]")).map((element) => ({
    element,
    baseWidth: 0,
    baseHeight: 0,
    value: 0,
    velocity: 0,
    target: 0,
  }));

  let enabled = false;
  let pointerActive = false;
  let dirty = false;
  let frame = 0;

  const canAnimate = () => !reducedQuery.matches && root.clientWidth > 0 && window.innerWidth > 768 && precisionQuery.matches;

  const measure = () => {
    enabled = canAnimate();
    for (const state of items) {
      state.element.style.width = "";
      state.element.style.height = "";
      state.element.style.transform = "";
      state.element.dataset['dockNear'] = "false";
    }
    for (const state of items) {
      const rect = state.element.getBoundingClientRect();
      state.baseWidth = rect.width;
      state.baseHeight = rect.height;
      state.value = 0;
      state.velocity = 0;
      state.target = 0;
    }
    pointerActive = false;
    dirty = false;
    root.dataset['dockState'] = enabled ? "idle" : "static";
  };

  const setTargets = (clientX: number) => {
    if (!enabled) return;
    const options = getOptions();
    const rects = items.map((state) => state.element.getBoundingClientRect());
    for (let index = 0; index < items.length; index += 1) {
      const rect = rects[index]!;
      const center = rect.left + rect.width * 0.5;
      const proximity = clamp(1 - Math.abs(clientX - center) / Math.max(1, options.proximity), 0, 1);
      const influence = proximity * proximity * (3 - 2 * proximity);
      items[index]!.target = influence;
      items[index]!.element.dataset['dockNear'] = influence > 0.08 ? "true" : "false";
    }
    pointerActive = true;
    dirty = true;
    root.dataset['dockState'] = "active";
  };

  const focusItem = (item: HTMLElement) => {
    if (!enabled) return;
    const index = items.findIndex((state) => state.element === item);
    if (index < 0) return;
    items.forEach((state, itemIndex) => {
      state.target = itemIndex === index ? 1 : Math.abs(itemIndex - index) === 1 ? 0.24 : 0;
      state.element.dataset['dockNear'] = state.target > 0.08 ? "true" : "false";
    });
    pointerActive = false;
    dirty = true;
    root.dataset['dockState'] = "focus";
  };

  const reset = () => {
    pointerActive = false;
    dirty = true;
    items.forEach((state) => {
      state.target = 0;
      state.element.dataset['dockNear'] = "false";
    });
  };

  const draw = () => {
    if (enabled && dirty) {
      const options = getOptions();
      let moving = false;
      for (const state of items) {
        state.velocity += (state.target - state.value) * options.spring;
        state.velocity *= options.damping;
        state.value += state.velocity;
        if (Math.abs(state.target - state.value) < 0.001 && Math.abs(state.velocity) < 0.001) {
          state.value = state.target;
          state.velocity = 0;
        } else {
          moving = true;
        }

        const value = clamp(state.value, 0, 1.08);
        const extraWidth = Math.min(options.widthGrowth, state.baseWidth * 0.3);
        state.element.style.width = `${(state.baseWidth + extraWidth * value).toFixed(2)}px`;
        state.element.style.height = `${(state.baseHeight + options.heightGrowth * value).toFixed(2)}px`;
        state.element.style.transform = `translateY(${(value * options.drop).toFixed(2)}px)`;
      }
      if (!moving) {
        dirty = false;
        if (items.every((state) => state.target === 0)) root.dataset['dockState'] = "idle";
      }
    }
    frame = requestAnimationFrame(draw);
  };

  const onPointerMove = (event: PointerEvent) => setTargets(event.clientX);
  const onWindowPointerMove = (event: PointerEvent) => {
    if (!pointerActive) return;
    const rootRect = root.getBoundingClientRect();
    const itemRects = items.map((state) => state.element.getBoundingClientRect());
    const bottom = Math.max(rootRect.bottom, ...itemRects.map((rect) => rect.bottom));
    const outside = event.clientX < rootRect.left || event.clientX > rootRect.right || event.clientY < rootRect.top || event.clientY > bottom;
    if (outside) reset();
  };
  const onFocusIn = (event: FocusEvent) => {
    const item = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-dock-item]");
    if (item) focusItem(item);
  };
  const onFocusOut = () =>
    requestAnimationFrame(() => {
      if (!root.contains(document.activeElement)) reset();
    });

  // A ResizeObserver on the parent (as the reference uses) would work for an
  // absolutely-positioned dock floating outside layout flow. This dock sits
  // inline in the header's flex row instead, so its own hover-growth changes
  // the parent's box — observing it would re-trigger measure() every frame
  // and reset the animation it just applied. Window resize is what we
  // actually need to react to (breakpoint/orientation changes), so listen
  // to that directly instead.
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerleave", reset);
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
  window.addEventListener("resize", measure);
  reducedQuery.addEventListener("change", measure);
  precisionQuery.addEventListener("change", measure);
  measure();
  frame = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(frame);
    root.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("pointerleave", reset);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    window.removeEventListener("pointermove", onWindowPointerMove);
    window.removeEventListener("resize", measure);
    reducedQuery.removeEventListener("change", measure);
    precisionQuery.removeEventListener("change", measure);
  };
}
