'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cc_iglesia_id';

export function useIglesia() {
  const [iglesiaId, setIglesiaIdState] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setIglesiaIdState(Number(stored));
  }, []);

  const setIglesiaId = (id: number) => {
    localStorage.setItem(STORAGE_KEY, String(id));
    setIglesiaIdState(id);
  };

  return { iglesiaId, setIglesiaId };
}
