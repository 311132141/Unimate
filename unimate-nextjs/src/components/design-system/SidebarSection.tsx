import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  return (
    <Card className={cn("border-0 bg-card/50 backdrop-blur", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-[1px]">
            {children}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}