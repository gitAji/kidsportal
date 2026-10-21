// ─── Single source of truth for site-wide SEO config ─────────────────────────
// Used by robots.js, sitemap.js, and the root layout's metadata.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kidsportal.com";
export const SITE_NAME = "KidsPortal";

// Netlify sets CONTEXT to "production", "deploy-preview", "branch-deploy", or
// "dev" at build time. Any non-production deploy (like the preview sites for
// open PRs) should never be indexed, so callers can gate on this.
export const IS_PREVIEW_DEPLOY =
  process.env.CONTEXT === "deploy-preview" || process.env.CONTEXT === "branch-deploy";
