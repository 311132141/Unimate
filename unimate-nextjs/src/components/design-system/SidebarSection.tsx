import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  return (
    <div
      className={cn("relative w-[312px]", className)}
      style={{
        background: '#282828',
        backdropFilter: 'blur(15.41px)',
        borderRadius: '26px',
        border: '2px solid #ffffff',
        boxShadow: '0px 1.541px 0px 0px rgba(0,0,0,0.05), 0px 6.164px 6.164px 0px rgba(0,0,0,0.05), 0px 15.41px 15.41px 0px rgba(0,0,0,0.1)'
      }}
    >
      {/* Section title positioned exactly as in Figma */}
      <div
        className="absolute left-6 top-[41.5px] -translate-y-1/2"
        style={{
          fontFamily: '"Geist", sans-serif',
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: 1,
          color: '#ffffff'
        }}
      >
        {title}
      </div>

      {/* Content area positioned exactly as in Figma */}
      <div className="absolute left-[18px] top-[69px] w-[280px]">
        {children}
      </div>
    </div>
  );
}