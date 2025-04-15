
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard } from "lucide-react";

type Activity = {
  type: string;
  status: string;
  timestamp: Date;
  address?: string;
};

type RecentActivitiesProps = {
  activities: Activity[];
  isLoading: boolean;
};

export const RecentActivities = ({ activities, isLoading }: RecentActivitiesProps) => {
  // Format account address
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest blockchain transactions and activities</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">Loading activities from blockchain...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  {activity.type === 'KYC Verification' ? (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{activity.type}</span>
                  {activity.status === 'Pending' && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                  )}
                  {activity.status === 'Approved' && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                  )}
                  {activity.status === 'Rejected' && (
                    <Badge variant="destructive">Rejected</Badge>
                  )}
                  {activity.status === 'Created' && (
                    <Badge variant="outline">Created</Badge>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activity.timestamp)}
                  </span>
                  {activity.address && (
                    <span className="text-xs text-muted-foreground">
                      {formatAddress(activity.address)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">No recent activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
