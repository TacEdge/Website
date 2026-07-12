// Prefix for static assets referenced by URL (e.g. /brand/*.svg).
// Next's router handles basePath for links; plain <img> srcs need this.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
