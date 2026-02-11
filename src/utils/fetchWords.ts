import { Word, WordManifest } from '../types';

/**
 * Fetches words from a manifest file.
 * If weekPath is provided, loads from that week's folder.
 * Otherwise loads from the root manifest (current week).
 * Falls back to plain text file if manifest doesn't exist.
 */
export async function fetchWords(weekPath?: string): Promise<Word[]> {
  const manifestUrl = weekPath ? `${weekPath}/manifest.json` : '/manifest.json';

  // Try to load the generated manifest first
  try {
    const manifestResponse = await fetch(manifestUrl);
    if (manifestResponse.ok) {
      const manifest: WordManifest = await manifestResponse.json();
      return manifest.words;
    }
  } catch (error) {
    console.log('Manifest not found, falling back to text file');
  }

  // Fallback: load plain text file (only for current week / development)
  if (!weekPath) {
    try {
      const response = await fetch('/words_of_week.txt');
      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }

      const text = await response.text();
      const uniqueTexts = [...new Set(
        text
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
      )];

      return uniqueTexts.map((text) => ({
        id: text,
        text,
      }));
    } catch (error) {
      console.error('Error fetching words:', error);
      return [];
    }
  }

  return [];
}
