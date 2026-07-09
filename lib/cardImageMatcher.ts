import sharp from "sharp";

export type ImageMatchResult = {
  card: any;
  imageScore: number;
  distance: number;
};

const HASH_SIZE = 16;

async function createHashFromBuffer(buffer: Buffer): Promise<string> {
  const raw = await sharp(buffer)
    .resize(HASH_SIZE, HASH_SIZE, {
      fit: "cover",
      position: "center",
    })
    .grayscale()
    .raw()
    .toBuffer();

  const pixels = Array.from(raw) as number[];

  const average =
    pixels.reduce((sum: number, value: number) => sum + value, 0) /
    Math.max(pixels.length, 1);

  return pixels.map((value: number) => (value >= average ? "1" : "0")).join("");
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();

    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

function hammingDistance(a: string, b: string): number {
  const length = Math.min(a.length, b.length);
  let distance = 0;

  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      distance++;
    }
  }

  return distance + Math.abs(a.length - b.length);
}

function distanceToScore(distance: number) {
  const maxDistance = HASH_SIZE * HASH_SIZE;
  const similarity = 1 - distance / maxDistance;

  return Math.max(0, Math.min(100, Math.round(similarity * 100)));
}

export async function compareImageToCards(
  uploadedImageBuffer: Buffer,
  cards: any[]
): Promise<ImageMatchResult[]> {
  const uploadedHash = await createHashFromBuffer(uploadedImageBuffer);

  const limitedCards = cards.slice(0, 24);

  const results = await Promise.all(
    limitedCards.map(async (card: any) => {
      const imageUrl = card?.images?.small || card?.images?.large;

      if (!imageUrl) {
        return {
          card,
          imageScore: 0,
          distance: HASH_SIZE * HASH_SIZE,
        };
      }

      const officialBuffer = await fetchImageBuffer(imageUrl);

      if (!officialBuffer) {
        return {
          card,
          imageScore: 0,
          distance: HASH_SIZE * HASH_SIZE,
        };
      }

      const officialHash = await createHashFromBuffer(officialBuffer);
      const distance = hammingDistance(uploadedHash, officialHash);

      return {
        card,
        imageScore: distanceToScore(distance),
        distance,
      };
    })
  );

  return results.sort((a, b) => b.imageScore - a.imageScore);
}

export async function getImageHashForDebug(buffer: Buffer) {
  return createHashFromBuffer(buffer);
}