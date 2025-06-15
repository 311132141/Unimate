'use client';

import { SearchInput } from "@/components/design-system/SearchInput";
import { cn } from "@/lib/utils";

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
    <div className="bg-[#000000] h-screen relative overflow-hidden">
      {/* Title */}
      <div
        className="absolute left-[26px] top-[54px] -translate-y-1/2"
        style={{
          fontFamily: '"Geist", sans-serif',
          fontWeight: 500,
          fontSize: '40px',
          lineHeight: 1,
          color: '#ffffff'
        }}
      >
        {title}
      </div>

      {/* Search Input */}
      <div className="absolute left-[837px] top-7 w-[406px]">
        <SearchInput />
      </div>      {/* Login/Print Button - Exact match from Figma */}
      <div className="absolute left-[1264px] top-7">
        <button
          onClick={isLoggedIn ? onPrint : onLogin}
          className="backdrop-blur-[15.41px] bg-[#5872c6] h-[58px] w-[178px] rounded-xl border-[1.54103px] border-white flex items-center justify-center"
          style={{
            fontFamily: '"Geist", sans-serif',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: 1,
            color: '#f8fafc',
            boxShadow: '0px 1.54103px 0px 0px rgba(0,0,0,0.05), 0px 6.1641px 6.1641px 0px rgba(0,0,0,0.05), 0px 15.4103px 15.4103px 0px rgba(0,0,0,0.1)'
          }}
        >
          {isLoggedIn ? 'Print' : 'Log in'}
        </button>
      </div>

      {/* Sidebar Content positioned exactly as in Figma */}
      <div className="absolute left-[26px] top-[105px]">
        {sidebarContent}
      </div>      {/* Main Content - Exact sizing and positioning from Figma */}
      <div className="absolute left-[360px] top-[105px] w-[1082px] h-[816px] z-10">
        {children}
      </div>
    </div>
  );
}