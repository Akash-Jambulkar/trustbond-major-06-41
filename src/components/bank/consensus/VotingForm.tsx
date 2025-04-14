
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VotingFormProps {
  isSubmitting: boolean;
  initialVote: boolean | null;
  onSubmit: (approved: boolean, notes: string) => void;
}

export function VotingForm({ isSubmitting, initialVote, onSubmit }: VotingFormProps) {
  const [voteApproval, setVoteApproval] = useState<boolean | null>(initialVote);
  const [voteNotes, setVoteNotes] = useState('');
  
  const handleSubmit = () => {
    if (voteApproval === null) return;
    onSubmit(voteApproval, voteNotes);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium">Your Verification Decision</h3>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={voteApproval === true ? "default" : "outline"}
            className={`flex-1 ${voteApproval === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={() => setVoteApproval(true)}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            type="button"
            variant={voteApproval === false ? "default" : "outline"}
            className={`flex-1 ${voteApproval === false ? 'bg-red-600 hover:bg-red-700' : ''}`}
            onClick={() => setVoteApproval(false)}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (Optional)</label>
        <Textarea 
          placeholder="Add verification notes..." 
          value={voteNotes}
          onChange={(e) => setVoteNotes(e.target.value)}
          className="resize-none h-24"
        />
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={voteApproval === null || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Vote'}
      </Button>
    </div>
  );
}
