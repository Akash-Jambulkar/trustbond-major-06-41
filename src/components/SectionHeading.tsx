
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading = ({ 
  title, 
  subtitle, 
  centered = false,
  className
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "mb-16", 
      centered && "text-center",
      className
    )}>
      <div className="inline-block">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 relative">
          {title}
          <div className="h-1 w-1/3 bg-gradient-to-r from-trustbond-primary to-trustbond-secondary rounded-full mt-2"></div>
        </h2>
      </div>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-3xl mt-4">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
