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
 *   images/brand/   — logo marks, OG share image, review QR code
 *
 * Event posters live directly in src/data/content.json's `events` array
 * (each entry has its own `poster` field pointing into images/gallery/).
 */
export const images = {
  hero: {
    main: "/images/hero/hero-main.jpg",
  },
  gallery: {
    loungeBright: "/images/gallery/lounge-bright.jpg",
    bulldogStatueHookah: "/images/gallery/bulldog-statue-hookah.jpg",
    barCandles: "/images/gallery/bar-candles.jpg",
    mirrorArches: "/images/gallery/mirror-arches.jpg",
    bulldogStatueMain: "/images/gallery/bulldog-statue-main.jpg",
  },
  brand: {
    logo: "/images/brand/logo.png",
    logoMark: "/images/brand/logo-mark.png",
    logoWord: "/images/brand/logo-word.png",
    og: "/images/brand/og.jpg",
    reviewQr: "/images/brand/review-qr.png",
  },
} as const;
