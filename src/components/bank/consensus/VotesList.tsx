
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface Vote {
  bankId: string;
  bankName: string;
  approved: boolean;
  timestamp: string;
  notes?: string;
}

interface VotesListProps {
  votes: Vote[];
}

export function VotesList({ votes }: VotesListProps) {
  if (votes.length === 0) return null;
  
  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-2">Verification Votes</p>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {votes.map((vote, index) => (
          <div 
            key={index} 
            className={`text-xs p-2 rounded-md flex items-start gap-2 ${
              vote.approved 
                ? 'bg-green-50 border border-green-100' 
                : 'bg-red-50 border border-red-100'
            }`}
          >
            {vote.approved ? (
              <ThumbsUp className="h-3 w-3 text-green-600 mt-0.5" />
            ) : (
              <ThumbsDown className="h-3 w-3 text-red-600 mt-0.5" />
            )}
            <div>
              <p className={vote.approved ? 'text-green-700' : 'text-red-700'}>
                <span className="font-medium">{vote.bankName}</span> {vote.approved ? 'approved' : 'rejected'} this document
              </p>
              <p className="text-gray-500">{new Date(vote.timestamp).toLocaleString()}</p>
              {vote.notes && (
                <p className="mt-1 italic">{vote.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
