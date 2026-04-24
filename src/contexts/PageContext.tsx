import { createContext, useContext, ReactNode } from "react";

interface PageContextType {
  pageId: string;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children, pageId }: { children: ReactNode; pageId: string }) {
  return (
    <PageContext.Provider value={{ pageId }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    // Return default page ID if not within a provider (e.g. some standalone components)
    return { pageId: "11111111-1111-1111-1111-111111111111" };
  }
  return context;
}
