import { useState, useEffect } from 'react';
import { DicteeMetadata } from '../types';
import { fetchMetadata } from '../utils/fetchMetadata';

export function useMetadata(weekPath?: string) {
  const [metadata, setMetadata] = useState<DicteeMetadata | null>(null);

  useEffect(() => {
    fetchMetadata(weekPath).then(setMetadata);
  }, [weekPath]);

  return metadata;
}
