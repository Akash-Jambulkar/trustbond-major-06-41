
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  className
}: FeatureCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 card-hover overflow-hidden border border-gray-100 group",
      className
    )}>
      <div className="p-6 relative z-10">
        <div className="bg-trustbond-primary/10 w-16 h-16 flex items-center justify-center rounded-lg mb-5 group-hover:scale-110 transition-transform">
          <Icon className="h-8 w-8 text-trustbond-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-trustbond-dark">{title}</h3>
        <p className="text-trustbond-muted">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-trustbond-primary/5 to-trustbond-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default FeatureCard;
