export function useGraphicsStore() {
  return useCookie('graphics', {
    default: () => true,
  })
}
