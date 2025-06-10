'use client';

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/design-system/SearchInput";

interface KioskLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onPrint?: () => void;
  title?: string;
}

export function KioskLayout({
  children,
  sidebarContent,
  isLoggedIn = false,
  onLogin,
  onPrint,
  title = "Map"
}: KioskLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-background border-r border-border p-6 space-y-6 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-border">
          <h1 className="text-2xl font-medium">{title}</h1>
          
          <div className="flex items-center gap-4">
            <SearchInput className="w-96" />
            {isLoggedIn ? (
              <Button 
                onClick={onPrint}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Print
              </Button>
            ) : (
              <Button 
                onClick={onLogin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Log in
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}