import { useState, useEffect } from 'react';
import { categoriesService } from '../services/categories.service';
import { DEFAULT_CATEGORIES } from '../constants';
import { authService } from '../services/auth.service';

/**
 * Fetches category names from GET /api/Categories.
 * Falls back to DEFAULT_CATEGORIES if the request fails or returns no data.
 */
export function useCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) return;

    setLoading(true);
    categoriesService
      .getAll()
      .then((data) => {
        // CategoryDto.categoryName is the display name
        const names = (data ?? []).map((c) => c.categoryName).filter(Boolean);
        if (names.length > 0) setCategories(names);
      })
      .catch(() => {
        // Keep defaults — API may not have seed data yet
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
