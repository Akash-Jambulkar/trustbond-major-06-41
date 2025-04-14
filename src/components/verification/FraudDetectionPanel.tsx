
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle, Check, Shield, Search } from "lucide-react";
import { detectPotentialFraud, checkSimilarDocuments } from "@/utils/uniquenessVerifier";
import { DocumentType } from "@/utils/documentHash";

interface FraudDetectionPanelProps {
  documentType: DocumentType;
  documentNumber: string;
  onAnalysisComplete?: (result: { isSuspicious: boolean; reasons: string[] }) => void;
}

export function FraudDetectionPanel({
  documentType,
  documentNumber,
  onAnalysisComplete
}: FraudDetectionPanelProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<{
    isSuspicious: boolean;
    reasons: string[];
    confidenceScore: number;
    similarDocuments?: any[];
  } | null>(null);
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const runAnalysis = async () => {
    setIsLoading(true);
    setProgress(0);
    setStep(1);
    
    try {
      // Step 1: Basic fraud detection
      setProgress(20);
      const fraudDetectionResult = await detectPotentialFraud(documentType, documentNumber);
      setProgress(50);
      setStep(2);
      
      // Step 2: Check for similar documents
      const similarDocsResult = await checkSimilarDocuments(documentType, documentNumber);
      setProgress(80);
      setStep(3);
      
      // Combine results
      const combinedResult = {
        isSuspicious: fraudDetectionResult.isSuspicious || similarDocsResult.hasSimilar,
        reasons: [
          ...fraudDetectionResult.reasons,
          ...(similarDocsResult.hasSimilar 
            ? [`Found ${similarDocsResult.similarDocuments.length} similar document(s) in the system`] 
            : [])
        ],
        confidenceScore: fraudDetectionResult.confidenceScore,
        similarDocuments: similarDocsResult.similarDocuments
      };
      
      setAnalysisResult(combinedResult);
      setProgress(100);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(combinedResult);
      }
    } catch (error) {
      console.error("Error running fraud analysis:", error);
      setAnalysisResult({
        isSuspicious: false,
        reasons: ["Error analyzing document. Analysis could not be completed."],
        confidenceScore: 0
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-trustbond-primary" />
          Fraud Detection Analysis
        </CardTitle>
        <CardDescription>
          Advanced document verification to detect potential fraud
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isLoading && !analysisResult && (
          <Button onClick={runAnalysis} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Run Fraud Analysis
          </Button>
        )}
        
        {isLoading && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-trustbond-primary" />
                <span className="font-medium">
                  {step === 1 && "Running pattern analysis..."}
                  {step === 2 && "Checking for similar documents..."}
                  {step === 3 && "Finalizing results..."}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {analysisResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Analysis Results</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm">Confidence:</span>
                <Progress value={analysisResult.confidenceScore * 100} className="w-24 h-2" />
                <span className="text-sm">{Math.round(analysisResult.confidenceScore * 100)}%</span>
              </div>
            </div>
            
            <Separator />
            
            {analysisResult.isSuspicious ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Suspicious Document Detected</AlertTitle>
                <AlertDescription>
                  This document has been flagged as potentially fraudulent.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">No Suspicious Patterns Detected</AlertTitle>
                <AlertDescription className="text-green-700">
                  This document passed all fraud detection checks.
                </AlertDescription>
              </Alert>
            )}
            
            {analysisResult.reasons.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Detection Reasons:</h4>
                <ul className="space-y-1">
                  {analysisResult.reasons.map((reason, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysisResult.similarDocuments && analysisResult.similarDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Similar Documents Found:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {analysisResult.similarDocuments.map((doc, index) => (
                    <div key={index} className="text-sm p-2 bg-amber-50 border border-amber-100 rounded-md">
                      <p><span className="font-medium">Document Number:</span> {doc.document_number}</p>
                      <p><span className="font-medium">Status:</span> {doc.verification_status}</p>
                      <p><span className="font-medium">Submitted:</span> {new Date(doc.submitted_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <Button onClick={runAnalysis} variant="outline" size="sm">
                Run Analysis Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
