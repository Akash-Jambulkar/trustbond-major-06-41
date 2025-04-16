
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetric } from "./types";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MetricCardProps {
  metric: DashboardMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  // Function to determine border color based on metric title or status
  const getBorderColor = () => {
    if (metric.title.toLowerCase().includes("kyc") || metric.title.toLowerCase().includes("verification")) {
      return "border-l-trustbond-primary";
    } else if (metric.title.toLowerCase().includes("score") || metric.title.toLowerCase().includes("trust")) {
      return "border-l-trustbond-secondary";
    } else if (metric.title.toLowerCase().includes("loan")) {
      return "border-l-trustbond-accent";
    } else {
      return "border-l-gray-400";
    }
  };

  // Status indicator
  const StatusIndicator = () => {
    if (!metric.status) return null;
    
    if (metric.status === "up") {
      return (
        <div className="flex items-center space-x-1">
          <div className="bg-green-100 p-1 rounded">
            <ArrowUp className="h-3 w-3 text-green-600" />
          </div>
        </div>
      );
    } else if (metric.status === "down") {
      return (
        <div className="flex items-center space-x-1">
          <div className="bg-red-100 p-1 rounded">
            <ArrowDown className="h-3 w-3 text-red-600" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <div className="bg-gray-100 p-1 rounded">
            <Minus className="h-3 w-3 text-gray-600" />
          </div>
        </div>
      );
    }
  };

  return (
    <Card className={`shadow-sm hover:shadow transition-shadow duration-200 border-l-4 ${getBorderColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{metric.title}</CardTitle>
        {metric.icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold my-2">{metric.value}</div>
        {metric.change && (
          <div className="flex items-center justify-between mt-2 bg-gray-50 p-1.5 rounded-md">
            <StatusIndicator />
            <p
              className={`text-sm font-medium ${
                metric.status === "up"
                  ? "text-green-600"
                  : metric.status === "down"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {metric.change}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
