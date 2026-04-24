import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";

const COMMON_ICONS = [
  "Rocket", "Zap", "CheckCircle2", "Star", "Monitor", "Layers", "Wrench", "Eye", 
  "FileText", "Layout", "Printer", "Users", "Award", "Code", "BrainCircuit", 
  "AppWindow", "Bot", "Bug", "PackageOpen", "Play", "Video", "Image", 
  "Smartphone", "Headphones", "XCircle", "Box", "Cpu", "Server", "Database", "Cloud", "Globe"
];

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const ActiveIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle;

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-2 cursor-pointer border rounded-md px-3 py-2 bg-background hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-6 w-6 items-center justify-center text-primary bg-primary/10 rounded-full shrink-0">
          <ActiveIcon size={14} />
        </div>
        <div className="flex-1 text-sm font-medium">
          {value || "Chọn Icon"}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 w-[240px] p-3 bg-card border rounded-lg shadow-lg grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto">
          {COMMON_ICONS.map(iconName => {
            const Icon = (LucideIcons as any)[iconName];
            return (
              <button
                key={iconName}
                type="button"
                className={`p-2 border rounded hover:bg-primary/10 flex items-center justify-center transition-colors ${value === iconName ? 'bg-primary/10 border-primary/50 text-primary' : 'text-muted-foreground'}`}
                onClick={() => {
                  onChange(iconName);
                  setIsOpen(false);
                }}
                title={iconName}
              >
                <Icon size={16} />
              </button>
            )
          })}
        </div>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}
