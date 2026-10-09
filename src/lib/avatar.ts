/**
 * Generates a deterministic crypto-style avatar URL using the DiceBear API.
 * The same seed always produces the same avatar, so the card looks consistent
 * across re-renders while still feeling "unique" per user/skill.
 *
 * Styles used are visually associated with crypto / Web3 aesthetics:
 *  - "identicon"  → classic Ethereum-style blocky identicons
 *  - "rings"      → concentric geometric rings
 *  - "shapes"     → bold geometric shapes
 *  - "bottts"     → retro robot avatars (common in DeFi UIs)
 *  - "pixel-art"  → 8-bit pixel characters
 */

const CRYPTO_STYLES = [
  "identicon",
  "rings",
  "shapes",
  "bottts",
  "pixel-art",
] as const;

type CryptoStyle = (typeof CRYPTO_STYLES)[number];

/**
 * Picks a style deterministically from the seed so the avatar is stable.
 * Uses a simple djb2-like hash to map any string to one of the styles.
 */
function pickStyle(seed: string): CryptoStyle {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  const index = Math.abs(hash) % CRYPTO_STYLES.length;
  return CRYPTO_STYLES[index];
}

/**
 * Returns a DiceBear SVG avatar URL for the given seed.
 *
 * @param seed  Any stable string that identifies the user (clerkId, email, id…).
 *              Falls back to a random UUID when empty so the card never breaks.
 */
export function getCryptoAvatarUrl(seed: string | null | undefined): string {
  const safeSeed = seed?.trim() || crypto.randomUUID();
  const style = pickStyle(safeSeed);
  const params = new URLSearchParams({ seed: safeSeed });
  return `https://api.dicebear.com/9.x/${style}/svg?${params}`;
}

