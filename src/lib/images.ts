/**
 * Centralized image registry for Smoke Dog.
 *
 * Every hardcoded image path used by components/layout/schema lives here.
 * To swap a photo: replace the file on disk (keep the same name) — zero
 * code changes needed. To add a brand-new photo, drop it into the matching
 * folder under /public/images/ and reference it from here (or, for
 * gallery/events, add an entry in src/data/content.json).
 *
 * Folder map — see /public/images/README.md for the full guide:
 *   images/hero/    — homepage hero visual (1 photo, most important asset)
 *   images/gallery/ — venue photography reused across sections + the /gallery page
 *   images/events/  — event/afisha posters and videos
 *   images/brand/   — logo marks, OG share image, review QR code
 */
export const images = {
  hero: {
    main: "/images/hero/hero-main.jpg",
  },
  gallery: {
    loungeHall: "/images/gallery/lounge-hall.jpg",
    barCounter: "/images/gallery/bar-counter.jpg",
    dogStatue: "/images/gallery/dog-statue.jpg",
    mirrorWall: "/images/gallery/mirror-wall.jpg",
    loungeGreen: "/images/gallery/lounge-green.jpg",
  },
  events: {
    soulSaturdayPoster: "/images/events/soul-saturday-poster.jpg",
  },
  brand: {
    logo: "/images/brand/logo.png",
    logoMark: "/images/brand/logo-mark.png",
    logoWord: "/images/brand/logo-word.png",
    og: "/images/brand/og.jpg",
    reviewQr: "/images/brand/review-qr.png",
  },
} as const;
