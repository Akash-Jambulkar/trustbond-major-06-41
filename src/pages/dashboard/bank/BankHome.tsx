
import React from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { RecentActivities } from "@/components/bank/dashboard/RecentActivities";
import { QuickActions } from "@/components/bank/dashboard/QuickActions";
import { MetricsCards } from "@/components/bank/dashboard/MetricsCards";
import { ComplianceAndRisk } from "@/components/bank/dashboard/ComplianceAndRisk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkStatus } from "@/components/NetworkStatus";
import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { toast } from "sonner";

const BankHome = () => {
  const { 
    isConnected, 
    account, 
    networkId, 
    kycContract, 
    loanContract,
    getKYCStatus,
    refreshTransactions 
  } = useBlockchain();

  const [kycPendingCount, setKycPendingCount] = useState<number>(0);
  const [activeLoansCount, setActiveLoansCount] = useState<number>(0);
  const [activeLoanAmount, setActiveLoanAmount] = useState<string>("0");
  const [trustScoreCount, setTrustScoreCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentActivities, setRecentActivities] = useState<Array<{
    type: string;
    status: string;
    timestamp: Date;
    address?: string;
  }>>([]);

  // Load dashboard data from blockchain
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isConnected || !kycContract || !loanContract) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get pending KYC documents count
        const pendingKYCEvents = await kycContract.getPastEvents('KYCSubmitted', {
          fromBlock: 0,
          toBlock: 'latest'
        });

        // Filter only pending documents (those without approval/rejection events)
        const verifiedAddresses = new Set();
        const rejectedAddresses = new Set();

        const verifiedEvents = await kycContract.getPastEvents('KYCVerified', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        
        verifiedEvents.forEach(event => {
          verifiedAddresses.add(event.returnValues.user);
        });

        const rejectedEvents = await kycContract.getPastEvents('KYCRejected', {
          fromBlock: 0,
          toBlock: 'latest'
        });
        
        rejectedEvents.forEach(event => {
          rejectedAddresses.add(event.returnValues.user);
        });

        // Count only those that are neither verified nor rejected
        const pendingCount = pendingKYCEvents.filter(event => {
          const address = event.returnValues.user;
          return !verifiedAddresses.has(address) && !rejectedAddresses.has(address);
        }).length;

        setKycPendingCount(pendingCount);

        // Get active loans
        const loanEvents = await loanContract.getPastEvents('LoanCreated', {
          fromBlock: 0,
          toBlock: 'latest'
        });

        const loanIds = loanEvents.map(event => event.returnValues.loanId);
        
        // Get loan details in batches to avoid gas limit issues
        const loanPromises = loanIds.map(id => loanContract.methods.getLoan(id).call());
        const loans = await Promise.all(loanPromises);
        
        // Filter active loans (status 4 or 5)
        const activeLoans = loans.filter(loan => 
          loan.status === '4' || loan.status === '5'
        );
        
        setActiveLoansCount(activeLoans.length);
        
        // Calculate total loan amount
        const totalAmount = activeLoans.reduce((acc, loan) => {
          const amount = window.web3?.utils.fromWei(loan.amount, 'ether') || '0';
          return acc + parseFloat(amount);
        }, 0);
        
        setActiveLoanAmount(totalAmount.toFixed(2));

        // Get trust score count
        setTrustScoreCount(verifiedAddresses.size);

        // Get recent activities
        const allEvents = [
          ...pendingKYCEvents.map(event => ({
            type: 'KYC Verification',
            status: 'Pending',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.user
          })),
          ...verifiedEvents.map(event => ({
            type: 'KYC Verification',
            status: 'Approved',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.user
          })),
          ...rejectedEvents.map(event => ({
            type: 'KYC Verification',
            status: 'Rejected',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.user
          })),
          ...loanEvents.map(event => ({
            type: 'Loan Application',
            status: 'Created',
            timestamp: new Date(parseInt(event.returnValues.timestamp) * 1000),
            address: event.returnValues.borrower
          }))
        ];

        // Sort by timestamp descending and take the first 5
        const sortedActivities = allEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 5);

        setRecentActivities(sortedActivities);

        // Refresh transactions
        await refreshTransactions();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data from blockchain");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
    
    // Set up real-time event listeners for immediate updates
    const setupEventListeners = async () => {
      if (!isConnected || !kycContract || !loanContract) return;
      
      // Listen for KYC submission events
      kycContract.events.KYCSubmitted({})
        .on('data', () => {
          loadDashboardData();
          toast.info("New KYC document submitted");
        });
      
      // Listen for KYC verification events
      kycContract.events.KYCVerified({})
        .on('data', () => {
          loadDashboardData();
          toast.success("KYC verification updated");
        });
      
      // Listen for loan creation events
      loanContract.events.LoanCreated({})
        .on('data', () => {
          loadDashboardData();
          toast.info("New loan application received");
        });
    };
    
    setupEventListeners();
    
    // Poll for updates every 30 seconds as a fallback
    const interval = setInterval(() => {
      if (isConnected) {
        loadDashboardData();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected, kycContract, loanContract, refreshTransactions]);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Bank Dashboard</h2>
          <NetworkStatus />
        </div>
        
        {/* Real-time dashboard metrics */}
        <DashboardStats userRole="bank" />
        
        {/* Tabs for Activities and Actions */}
        <Tabs defaultValue="requests">
          <TabsList>
            <TabsTrigger value="requests">Recent Activities</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="space-y-4">
            <RecentActivities 
              activities={recentActivities} 
              isLoading={isLoading} 
            />
          </TabsContent>
          <TabsContent value="actions" className="space-y-4">
            <QuickActions />
          </TabsContent>
        </Tabs>
        
        {/* Compliance and Risk Assessment */}
        <ComplianceAndRisk />
      </div>
    </DashboardLayout>
  );
};

export default BankHome;
