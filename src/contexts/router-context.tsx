"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface RouterState {
  lastPage: string | null;
  exploreFilters: {
    page: number;
    filters: Record<string, any>;
  } | null;
}

interface RouterContextType extends RouterState {
  setLastPage: (page: string) => void;
  setExploreFilters: (filters: RouterState["exploreFilters"]) => void;
  clearExploreFilters: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RouterState>({
    lastPage: null,
    exploreFilters: null,
  });

  const setLastPage = useCallback((page: string) => {
    setState(prev => ({ ...prev, lastPage: page }));
  }, []);

  const setExploreFilters = useCallback((filters: RouterState["exploreFilters"]) => {
    setState(prev => ({ ...prev, exploreFilters: filters }));
  }, []);

  const clearExploreFilters = useCallback(() => {
    setState(prev => ({ ...prev, exploreFilters: null }));
  }, []);

  return (
    <RouterContext.Provider value={{ ...state, setLastPage, setExploreFilters, clearExploreFilters }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouterState() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error("useRouterState must be used within a RouterProvider");
  }
  return context;
}
