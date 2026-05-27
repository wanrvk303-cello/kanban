import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('kanban-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kanban-theme', theme);
  }, [theme]);

  function toggle() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return { theme, toggle };
}
