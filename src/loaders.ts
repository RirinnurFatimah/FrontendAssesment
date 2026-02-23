import type { RegionData } from './types';

// Loader function - akan dipanggil saat route dimuat
export async function regionLoader(): Promise<RegionData> {
  const response = await fetch('/Data/indonesia_regions.json');
  if (!response.ok) {
    throw new Error('Failed to fetch region data');
  }
  return response.json();
}
