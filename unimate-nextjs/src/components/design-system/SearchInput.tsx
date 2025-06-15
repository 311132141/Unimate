import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "Find place",
  value,
  onChange,
  className
}: SearchInputProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-[14.8186px] bg-gradient-to-t from-[#ffffff1a] to-[#ffffff0d] to-[88.889%] h-[58px] w-[406px] rounded-xl relative flex items-center",
        className
      )}
    >
      <div className="absolute border-[#ffffff] border-[1.48186px] border-solid inset-0 pointer-events-none rounded-xl shadow-[0px_1.48186px_0px_0px_rgba(0,0,0,0.05),0px_5.92745px_5.92745px_0px_rgba(0,0,0,0.05),0px_14.8186px_14.8186px_0px_rgba(0,0,0,0.1)]" />
      <div className="flex items-center px-[18px] py-[5.927px] gap-[11.855px] w-full">
        {/* Icon Circle - exact match from Figma */}
        <div
          className="bg-gradient-to-b from-[#ffffff05] to-[#ffffff1a] rounded-[29.6372px] relative"
        >
          <div className="absolute border-[1.48186px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[29.6372px]" />
          <div className="flex flex-row items-center justify-center p-[5.92745px]">
            <Search
              className="w-[22.228px] h-[22.228px] text-white"
              strokeWidth={1.85233}
            />
          </div>
        </div>        {/* Input - exact match from Figma */}
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="basis-0 flex-1 grow bg-transparent text-white placeholder-white border-none outline-none min-h-px min-w-px"
          style={{
            fontFamily: '"Geist", sans-serif',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: 1,
            color: '#ffffff'
          }}
        />
      </div>
    </div>
  );
}