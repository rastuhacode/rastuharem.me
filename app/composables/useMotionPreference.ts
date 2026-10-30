export function useMotionPreference() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mounted = useMounted();
  // Wait for hydration before adding SVG animations to static HTML.
  const enabled = computed(() => mounted.value && !reducedMotion.value);

  return { enabled, reducedMotion };
}
