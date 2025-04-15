
import React from "react";
import { ComplianceCheckResult, performComplianceCheck } from "@/utils/api/regulatoryComplianceApi";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const ComplianceCheck: React.FC = () => {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["complianceCheck", user?.id],
    queryFn: () => performComplianceCheck(user?.id || ""),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
  
  if (isLoading) {
    return <ComplianceCheckSkeleton />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            Compliance Check Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Unable to retrieve compliance information. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (!data) return null;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Regulatory Compliance</CardTitle>
          <ComplianceStatusBadge status={data.status} />
        </div>
        <CardDescription>
          Last checked: {new Date(data.checkDate).toLocaleDateString()}
          {data.nextReviewDate && (
            <> • Next review: {new Date(data.nextReviewDate).toLocaleDateString()}</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {data.status === 'passed' ? (
                <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
              ) : data.status === 'pending' ? (
                <Clock className="h-5 w-5 mr-2 text-amber-600" />
              ) : (
                <ShieldAlert className="h-5 w-5 mr-2 text-red-600" />
              )}
              <span className="font-medium">{data.summary}</span>
            </div>
            
            <Badge 
              variant={data.riskLevel === 'low' ? 'outline' : 'secondary'}
              className={`
                ${data.riskLevel === 'low' && 'bg-green-50 text-green-700 hover:bg-green-100'} 
                ${data.riskLevel === 'medium' && 'bg-amber-50 text-amber-700 hover:bg-amber-100'} 
                ${data.riskLevel === 'high' && 'bg-red-50 text-red-700 hover:bg-red-100'}
              `}
            >
              {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)} Risk
            </Badge>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 pl-3">Check</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.details.map((detail, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/50'}>
                    <td className="p-2 pl-3">
                      <div className="font-medium">{detail.checkName}</div>
                      <div className="text-xs text-muted-foreground">{detail.description}</div>
                    </td>
                    <td className="p-2">
                      {detail.result === 'pass' ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-green-600">Passed</span>
                        </div>
                      ) : detail.result === 'pending' ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-amber-600 mr-1" />
                          <span className="text-amber-600">Pending</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                          <span className="text-red-600">Failed</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Skeleton loader for compliance check
const ComplianceCheckSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-24" />
          </div>
          
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Badge component for compliance status
const ComplianceStatusBadge: React.FC<{ status: 'passed' | 'failed' | 'pending' }> = ({ status }) => {
  switch (status) {
    case 'passed':
      return (
        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Passed
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
          <Clock className="h-3 w-3 mr-1" /> In Progress
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" /> Failed
        </Badge>
      );
  }
};
