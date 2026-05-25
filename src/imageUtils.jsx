import { useState } from 'react'

// ─── Central fallback image ────────────────────────────────────────────────────
export const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'

const UNSPLASH_RE = /^https?:\/\/images\.unsplash\.com\//

// ─── normalizeImageUrl ─────────────────────────────────────────────────────────
/**
 * Normalize a single image URL:
 *   • Trims whitespace
 *   • Validates URL structure (must be http / https)
 *   • Appends Unsplash optimisation params when not already present
 *   • Returns FALLBACK_IMG for any invalid / missing value
 */
export function normalizeImageUrl(url, { width = 800, quality = 80 } = {}) {
  if (!url || typeof url !== 'string') return FALLBACK_IMG
  const trimmed = url.trim()
  if (!trimmed) return FALLBACK_IMG

  try {
    const parsed = new URL(trimmed)
    if (!parsed.protocol.startsWith('http')) return FALLBACK_IMG

    if (UNSPLASH_RE.test(trimmed)) {
      if (!parsed.searchParams.has('w'))    parsed.searchParams.set('w',    String(width))
      if (!parsed.searchParams.has('auto')) parsed.searchParams.set('auto', 'format')
      if (!parsed.searchParams.has('fit'))  parsed.searchParams.set('fit',  'crop')
      if (!parsed.searchParams.has('q'))    parsed.searchParams.set('q',    String(quality))
      return parsed.toString()
    }

    return trimmed
  } catch {
    return FALLBACK_IMG
  }
}

// ─── getImageSrc ───────────────────────────────────────────────────────────────
/**
 * Defensively pick the first non-empty image URL string from an object.
 * Returns the RAW field value — normalization happens once at render time.
 *
 * Usage: getImageSrc(project, 'imageUrl', 'image', 'featuredImage')
 */
export function getImageSrc(obj, ...fields) {
  for (const field of fields) {
    const val = obj?.[field]
    if (val && typeof val === 'string' && val.trim()) return val.trim()
  }
  return FALLBACK_IMG
}

// ─── handleImageError ──────────────────────────────────────────────────────────
/**
 * onError handler — replaces a broken img src with the fallback.
 * Nulls out onerror first to prevent infinite reload loops.
 */
export function handleImageError(e, fallback = FALLBACK_IMG) {
  const img = e.currentTarget
  if (img.src !== fallback) {
    img.onerror = null
    img.src     = fallback
  }
}

// ─── LazyImage component ───────────────────────────────────────────────────────
/**
 * Drop-in <img> replacement with:
 *   • Shimmer skeleton while loading — parent must be position:relative
 *   • Smooth simultaneous cross-fade (shimmer out, image in)
 *   • Automatic Unsplash URL optimisation via normalizeImageUrl
 *   • Error fallback with loop-prevention
 *
 * Props:
 *   src       — raw image URL (normalized internally)
 *   alt       — alt text
 *   className — classes for the <img> element
 *   fallback  — URL to use when src fails (defaults to FALLBACK_IMG)
 *   width     — Unsplash w param  (default 800)
 *   quality   — Unsplash q param  (default 80)
 *   loading   — native loading attr (default "lazy")
 */
export function LazyImage({
  src,
  alt,
  className    = '',
  fallback     = FALLBACK_IMG,
  width        = 800,
  quality      = 80,
  loading: imgLoading = 'lazy',
}) {
  const [loaded,  setLoaded]  = useState(false)
  const [errored, setErrored] = useState(false)

  const normalized = normalizeImageUrl(errored ? fallback : src, { width, quality })

  return (
    <>
      {/* Shimmer skeleton — transitions out as the image fades in */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? 'opacity-0 pointer-events-none' : 'shimmer bg-white/5'
        }`}
        aria-hidden="true"
      />
      <img
        src={normalized}
        alt={alt}
        loading={imgLoading}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!errored) {
            setErrored(true)
            setLoaded(true) // remove shimmer even on failure
          }
        }}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  )
}
