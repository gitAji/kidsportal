import { SITE_URL, IS_PREVIEW_DEPLOY } from "@/lib/seo";

export default function robots() {
  // Netlify deploy previews and branch deploys are not the real site —
  // never let them get indexed under their own preview domain.
  if (IS_PREVIEW_DEPLOY) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/analytics",
          "/child-dashboard",
          "/child-profile",
          "/child-settings",
          "/billing",
          "/subscription-management",
          "/avatar-customizer",
          "/avatar-shop",
          "/sticker-book",
          "/payment",
          "/grades",
          "/support",
          "/profile",
          "/teacher-admin",
          "/super-admin",
          "/learning-zone",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
