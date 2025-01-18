import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TruncatedTagProps {
  tag: string;
  index: number;
  onClick?: (tag: string) => void;
  isSelected?: boolean;
}

export const TruncatedTag = ({ tag, index, onClick, isSelected }: TruncatedTagProps) => {
  const [displayTag, setDisplayTag] = useState(tag);
  const [needsTooltip, setNeedsTooltip] = useState(false);
  const tagRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const element = tagRef.current;
      if (element) {
        // Add a small buffer (2px) to prevent premature truncation
        const isOverflowing = element.scrollWidth > (element.clientWidth + 2);
        if (isOverflowing) {
          const computeDisplayTag = (text: string): string => {
            element.textContent = text + '...';
            // Add a small buffer (2px) to prevent premature truncation
            if (element.scrollWidth <= (element.clientWidth + 2)) {
              return text + '...';
            }
            return computeDisplayTag(text.slice(0, -1));
          };

          const truncatedText = computeDisplayTag(tag);
          setDisplayTag(truncatedText);
          setNeedsTooltip(true);
        } else {
          setDisplayTag(tag);
          setNeedsTooltip(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tag]);

  const tagContent = (
    <span 
      ref={tagRef}
      className={cn(
        "rounded-full bg-gray-100 px-3 py-1 text-sm text-[#292929] whitespace-nowrap overflow-hidden",
        onClick && "cursor-pointer hover:bg-gray-200 transition-colors",
        isSelected && "bg-gray-200"
      )}
      onClick={() => onClick?.(tag)}
    >
      {displayTag}
    </span>
  );

  if (needsTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {tagContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tag}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return tagContent;
};