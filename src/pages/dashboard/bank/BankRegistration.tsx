
import React from 'react';
import { BankRegistrationForm } from "@/components/bank/BankRegistrationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBankRegistrations, getBankRegistrationStatus } from "@/utils/bankRegistration";

const BankRegistrationPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bank Registration</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Register a New Bank</CardTitle>
          <CardDescription>Add a new bank to the TrustBond platform</CardDescription>
        </CardHeader>
        <CardContent>
          <BankRegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default BankRegistrationPage;
