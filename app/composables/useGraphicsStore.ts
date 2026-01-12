export function useGraphicsStore() {
  const isGraphicsEnabled = useCookie("is-graphics-enabled", {
    default: () => true,
  });

  return isGraphicsEnabled;
}
