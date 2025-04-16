
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
      "bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300",
      className
    )}>
      <div className="bg-trustbond-primary/10 w-14 h-14 flex items-center justify-center rounded-lg mb-5">
        <Icon className="h-7 w-7 text-trustbond-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
