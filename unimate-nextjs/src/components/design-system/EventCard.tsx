import Image from "next/image";
import { cn } from "@/lib/utils";

interface EventCardProps {
  category: string;
  title: string;
  time: string;
  organizer: string;
  thumbnail: string;
  onClick?: () => void;
  className?: string;
}

export function EventCard({
  category,
  title,
  time,
  organizer,
  thumbnail,
  onClick,
  className
}: EventCardProps) {
  return (
    <div
      className={cn(
        "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Separator line - exact from Figma */}
      <div className="h-0 relative w-full mb-[11px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 280 1"
          >
            <line
              stroke="#686868"
              x2="280"
              y1="0.5"
              y2="0.5"
            />
          </svg>
        </div>
      </div>

      {/* Event content - exact layout from Figma */}
      <div className="flex gap-[23px] items-start">
        <div className="flex-1 w-[195px]">
          <div className="flex flex-col gap-[3px] mb-2">
            <p
              className="text-[14px] text-[#afafaf]"
              style={{ fontFamily: '"Geist", sans-serif', fontWeight: 500, lineHeight: 1 }}
            >
              {category}
            </p>
            <h3
              className="text-[16px] text-[#ffffff]"
              style={{ fontFamily: '"Geist", sans-serif', fontWeight: 500, lineHeight: 1 }}
            >
              {title}
            </h3>
          </div>
          <div className="flex gap-[9px] items-center text-[14px]">
            <span
              className="text-[#b9b9b9]"
              style={{ fontFamily: '"Geist", sans-serif', fontWeight: 400, lineHeight: 1 }}
            >
              {time}{" "}
            </span>
            <span
              className="text-[#ffffff]"
              style={{ fontFamily: '"Geist", sans-serif', fontWeight: 500, lineHeight: 1 }}
            >
              By {organizer}
            </span>
          </div>
        </div>
        <div className="bg-white h-[59px] w-[63px] rounded-[9px] overflow-hidden flex-shrink-0">
          <Image
            src={thumbnail}
            alt=""
            width={77}
            height={72}
            className="w-[77px] h-[72px] object-cover -ml-[7px] -mt-[7px]"
          />
        </div>
      </div>
    </div>
  );
}