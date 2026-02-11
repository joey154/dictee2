import yaml from 'js-yaml';
import { DicteeMetadata } from '../types';

export async function fetchMetadata(weekPath?: string): Promise<DicteeMetadata | null> {
  const metadataUrl = weekPath ? `${weekPath}/metadata.yaml` : '/metadata.yaml';
  try {
    const response = await fetch(metadataUrl);
    if (!response.ok) return null;
    const text = await response.text();
    return yaml.load(text) as DicteeMetadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}
