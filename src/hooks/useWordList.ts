import { useState, useEffect } from 'react';
import { Word } from '../types';
import { fetchWords as fetchWordsFromFile } from '../utils/fetchWords';

interface UseWordListReturn {
  words: Word[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWordList(weekPath?: string): UseWordListReturn {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWords = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedWords = await fetchWordsFromFile(weekPath);
      setWords(fetchedWords);
    } catch (err) {
      setError('Failed to load words');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, [weekPath]);

  return { words, loading, error, refetch: loadWords };
}
