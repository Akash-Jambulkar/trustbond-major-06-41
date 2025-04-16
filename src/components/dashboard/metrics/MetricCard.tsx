
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetric } from "./types";

interface MetricCardProps {
  metric: DashboardMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
        {metric.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        {metric.change && (
          <p
            className={`text-xs ${
              metric.status === "up"
                ? "text-green-600"
                : metric.status === "down"
                ? "text-red-600"
                : "text-muted-foreground"
            }`}
          >
            {metric.change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
