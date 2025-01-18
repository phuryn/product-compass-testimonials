import { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedTagProps {
  tag: string;
  index: number;
}

export const TruncatedTag = ({ tag, index }: TruncatedTagProps) => {
  const tagRef = useRef<HTMLSpanElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [displayTag, setDisplayTag] = useState(tag);

  useEffect(() => {
    const checkOverflow = () => {
      const element = tagRef.current;
      if (element) {
        const isOverflowing = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
        if (isOverflowing && window.innerWidth < 1024 && window.location.pathname === '/embed') {
          const computeDisplayTag = (text: string): string => {
            element.textContent = text + '...';
            if (element.scrollHeight <= element.clientHeight && element.scrollWidth <= element.clientWidth) {
              return text + '...';
            }
            return computeDisplayTag(text.slice(0, -1));
          };
          
          element.textContent = tag;
          const truncatedText = computeDisplayTag(tag);
          setDisplayTag(truncatedText);
          setNeedsTruncation(true);
        } else {
          setDisplayTag(tag);
          setNeedsTruncation(false);
        }
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tag]);

  if (needsTruncation) {
    return (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span 
              ref={tagRef}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-[#292929] whitespace-nowrap overflow-hidden"
            >
              {displayTag}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tag}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <span 
      ref={tagRef}
      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-[#292929] whitespace-nowrap overflow-hidden"
    >
      {displayTag}
    </span>
  );
};