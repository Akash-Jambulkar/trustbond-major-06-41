
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
      "bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200",
      className
    )}>
      <div className="bg-cryptolock-primary/10 w-12 h-12 flex items-center justify-center rounded-md mb-4">
        <Icon className="h-6 w-6 text-cryptolock-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
