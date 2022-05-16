export const canUseDom = !!(
  typeof window !== "undefined" && window.document?.createElement
);
