
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, Clock } from "lucide-react";
import { format } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
  // Format account address with tooltip for full address
  const formatAddress = (address: string) => {
    if (!address) return "";
    const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded cursor-help">
            {shortAddress}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">{address}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Enhanced date formatting with time
  const formatDate = (date: Date) => {
    if (!date) return "";
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="whitespace-nowrap">
            {format(date, 'MMM d, yyyy')}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{format(date, 'PPpp')}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  // Get appropriate icon and color based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'KYC Verification':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'Loan Application':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get badge styling based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'Created':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Created</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Time elapsed since activity
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return format(date, 'MMM d');
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
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <p className="text-sm text-muted-foreground ml-2">Loading activities from blockchain...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.type}</span>
                      {getStatusBadge(activity.status)}
                    </div>
                    {activity.address && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Address: {formatAddress(activity.address)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {getTimeAgo(activity.timestamp)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
            <p className="text-sm font-medium">No recent activities</p>
            <p className="text-xs text-muted-foreground">Activities will appear here when transactions occur</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
