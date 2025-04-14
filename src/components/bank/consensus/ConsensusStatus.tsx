
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { ConsensusStatus, type ConsensusResult, type VerificationVote } from "@/utils/consensusVerifier";

interface ConsensusStatusProps {
  consensusData: ConsensusResult;
}

export function ConsensusStatusComponent({ consensusData }: ConsensusStatusProps) {
  const getStatusBadge = (status: ConsensusStatus) => {
    switch (status) {
      case ConsensusStatus.APPROVED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        );
      case ConsensusStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      case ConsensusStatus.IN_PROGRESS:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
    }
  };
  
  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-trustbond-primary" />
          Consensus Status
        </h3>
        {getStatusBadge(consensusData.status)}
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Verification Progress</p>
          <div className="flex items-center gap-4">
            <Progress 
              value={consensusData.progress} 
              className="h-2 flex-1"
            />
            <span className="text-sm font-medium">
              {Math.round(consensusData.progress)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {consensusData.votesReceived} of {consensusData.votesRequired} required votes received
          </p>
        </div>
        
        <div className="flex items-center justify-around mt-2">
          <div className="text-center">
            <div className="flex items-center gap-1 text-green-600">
              <ThumbsUp className="h-4 w-4" />
              <span className="font-bold">{consensusData.approvalsReceived}</span>
            </div>
            <p className="text-xs text-muted-foreground">Approvals</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 text-red-600">
              <ThumbsDown className="h-4 w-4" />
              <span className="font-bold">{consensusData.rejectionsReceived}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rejections</p>
          </div>
        </div>
      </div>
    </div>
  );
}
