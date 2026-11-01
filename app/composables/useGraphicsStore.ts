export function useGraphicsStore() {
  const preference = useCookie("graphics", {
    default: () => true,
    maxAge: 60 * 60 * 24 * 365,
  });
  const { reducedMotion } = useMotionPreference();

  return computed({
    get: () => !reducedMotion.value && preference.value,
    set: (value: boolean) => {
      preference.value = value;
    },
  });
}
