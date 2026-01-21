import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BentoGridProps = {
  className?: string;
  children: ReactNode;
};

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

type BentoGridItemProps = {
  className?: string;
  title: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridItemProps) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 border-cyan-300/60 border justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}

      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}

        <div className="font-sans font-bold text-cyan-300 mb-2 mt-2">
          {title}
        </div>

        {description && (
          <div className="font-sans font-normal text-cyan-500 text-xs">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};