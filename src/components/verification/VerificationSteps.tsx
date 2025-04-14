
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ArrowRight, Shield } from "lucide-react";

interface StepProps {
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming" | "failed";
  number: number;
}

const Step = ({ title, description, status, number }: StepProps) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex items-start">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
          status === "completed" 
            ? "bg-green-100 text-green-600"
            : status === "current"
            ? "bg-blue-100 text-blue-600"
            : status === "failed"
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-600"
        }`}>
          {status === "completed" ? (
            <CheckCircle className="h-5 w-5" />
          ) : status === "failed" ? (
            <XCircle className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium">{number}</span>
          )}
        </div>
        {number < 5 && (
          <div className="absolute top-8 left-1/2 bottom-0 w-px -translate-x-1/2 bg-gray-200" />
        )}
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          {status === "current" && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              In Progress
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

export function VerificationSteps({ currentStep = 1 }: { currentStep?: number }) {
  const steps = [
    {
      title: "Document Submission",
      description: "Upload your KYC documents securely to the platform",
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "upcoming"
    },
    {
      title: "Blockchain Hashing",
      description: "Documents are hashed and recorded on the blockchain for security",
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "upcoming"
    },
    {
      title: "Bank Verification",
      description: "Financial institutions verify your identity documents",
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "upcoming"
    },
    {
      title: "Consensus Verification",
      description: "Multiple banks agree on the validity of your documents",
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "upcoming"
    },
    {
      title: "Trust Score Generation",
      description: "Your trust score is calculated based on verification status",
      status: currentStep > 5 ? "completed" : currentStep === 5 ? "current" : "upcoming"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-trustbond-primary" />
          KYC Verification Process
        </CardTitle>
        <CardDescription>
          Follow these steps to complete your blockchain-based KYC verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            description={step.description}
            status={step.status as any}
            number={index + 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}
