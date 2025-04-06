
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, ComposedChart, PieChart, Pie, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { toast } from "sonner";
import { Users, CreditCard, Building2, Activity, Settings, Shield, PieChart as PieChartIcon, BarChart as BarChartIcon, CheckCircle, XCircle, Clock, User } from "lucide-react";

// Mock analytics data - System users
const mockUserStats = [
  { name: "Jan", users: 120, banks: 8, admins: 2 },
  { name: "Feb", users: 180, banks: 10, admins: 2 },
  { name: "Mar", users: 240, banks: 14, admins: 3 },
  { name: "Apr", users: 380, banks: 16, admins: 3 },
  { name: "May", users: 520, banks: 18, admins: 3 },
  { name: "Jun", users: 620, banks: 22, admins: 4 },
];

// Mock analytics data - KYC stats
const mockKycStats = [
  { name: "Jan", submitted: 105, verified: 90, rejected: 15 },
  { name: "Feb", submitted: 158, verified: 125, rejected: 33 },
  { name: "Mar", submitted: 210, verified: 180, rejected: 30 },
  { name: "Apr", submitted: 340, verified: 290, rejected: 50 },
  { name: "May", submitted: 460, verified: 380, rejected: 80 },
  { name: "Jun", submitted: 550, verified: 470, rejected: 80 },
];

// Mock analytics data - Loan stats
const mockLoanStats = [
  { name: "Jan", requested: 85, approved: 65, rejected: 20, value: 320000 },
  { name: "Feb", requested: 120, approved: 95, rejected: 25, value: 480000 },
  { name: "Mar", requested: 175, approved: 140, rejected: 35, value: 720000 },
  { name: "Apr", requested: 260, approved: 210, rejected: 50, value: 1050000 },
  { name: "May", requested: 340, approved: 270, rejected: 70, value: 1350000 },
  { name: "Jun", requested: 410, approved: 330, rejected: 80, value: 1650000 },
];

// Mock user distribution
const mockUserDistribution = [
  { name: "Users", value: 620 },
  { name: "Banks", value: 22 },
  { name: "Admins", value: 4 },
];

// Mock bank list
const mockBanks = [
  { id: 1, name: "Global Trust Bank", status: "active", usersVerified: 142, loansProcessed: 98, joinDate: "2025-01-15" },
  { id: 2, name: "Secure Finance", status: "active", usersVerified: 87, loansProcessed: 65, joinDate: "2025-01-22" },
  { id: 3, name: "Blockchain Capital", status: "pending", usersVerified: 0, loansProcessed: 0, joinDate: "2025-04-02" },
  { id: 4, name: "DeFi Solutions", status: "active", usersVerified: 112, loansProcessed: 76, joinDate: "2025-02-10" },
  { id: 5, name: "Future Finance", status: "inactive", usersVerified: 43, loansProcessed: 28, joinDate: "2025-02-18" },
];

// COLORS for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isConnected } = useBlockchain();
  const [userStats, setUserStats] = useState(mockUserStats);
  const [kycStats, setKycStats] = useState(mockKycStats);
  const [loanStats, setLoanStats] = useState(mockLoanStats);
  const [userDistribution, setUserDistribution] = useState(mockUserDistribution);
  const [banks, setBanks] = useState(mockBanks);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading data from blockchain/database
  useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      // Simulate API/blockchain data fetching delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Calculate platform statistics
  const totalUsers = userDistribution.reduce((sum, item) => sum + item.value, 0);
  const totalKycVerified = kycStats.reduce((sum, item) => sum + item.verified, 0);
  const totalKycRejected = kycStats.reduce((sum, item) => sum + item.rejected, 0);
  const totalLoansApproved = loanStats.reduce((sum, item) => sum + item.approved, 0);
  const totalLoansRejected = loanStats.reduce((sum, item) => sum + item.rejected, 0);
  const totalLoanValue = loanStats.reduce((sum, item) => sum + item.value, 0);

  // Handle bank status change
  const handleBankStatusChange = (bankId: number, newStatus: string) => {
    setBanks(prevBanks => 
      prevBanks.map(bank => 
        bank.id === bankId 
          ? { ...bank, status: newStatus } 
          : bank
      )
    );
    
    toast.success(`Bank status updated to ${newStatus} successfully!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-trustbond-dark">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview, analytics, and management</p>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Users</CardTitle>
              <CardDescription>All registered platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold text-trustbond-dark">
                    {totalUsers}
                  </div>
                  <div className="text-sm text-green-600">+{userStats[userStats.length-1].users - userStats[userStats.length-2].users} new this month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Banks</CardTitle>
              <CardDescription>Registered financial institutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building2 className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold text-trustbond-dark">
                    {userDistribution[1].value}
                  </div>
                  <div className="text-sm text-green-600">+{userStats[userStats.length-1].banks - userStats[userStats.length-2].banks} new this month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">KYC Verified</CardTitle>
              <CardDescription>Total verified identities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Shield className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold text-trustbond-dark">
                    {totalKycVerified}
                  </div>
                  <div className="text-sm text-green-600">+{kycStats[kycStats.length-1].verified - kycStats[kycStats.length-2].verified} this month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Loans</CardTitle>
              <CardDescription>Loan volume and value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-10 w-10 text-trustbond-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold text-trustbond-dark">
                    {totalLoansApproved}
                  </div>
                  <div className="text-sm text-green-600">${(totalLoanValue/1000000).toFixed(2)}M total value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="banks">Bank Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>User Growth</span>
                  </CardTitle>
                  <CardDescription>Monthly growth of platform users by role</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={userStats}
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                        >
                          <CartesianGrid stroke="#f5f5f5" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="users" name="Regular Users" fill="#0A2463" />
                          <Bar dataKey="banks" name="Banks" fill="#3E92CC" />
                          <Bar dataKey="admins" name="Admins" fill="#2EC4B6" />
                          <Line type="monotone" dataKey="users" name="User Trend" stroke="#ff7300" activeDot={{ r: 8 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Two Column Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KYC Verification Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>KYC Verification Stats</span>
                    </CardTitle>
                    <CardDescription>Monthly KYC submission and verification rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                      </div>
                    ) : (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={kycStats}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="submitted" name="Submitted" fill="#0A2463" />
                            <Bar dataKey="verified" name="Verified" fill="#2EC4B6" />
                            <Bar dataKey="rejected" name="Rejected" fill="#ff7782" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Loan Processing Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Loan Processing Stats</span>
                    </CardTitle>
                    <CardDescription>Monthly loan applications, approvals and rejections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                      </div>
                    ) : (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={loanStats}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="requested" name="Requested" stroke="#0A2463" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="approved" name="Approved" stroke="#2EC4B6" />
                            <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#ff7782" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* User Distribution and Loan Value */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      <span>User Distribution</span>
                    </CardTitle>
                    <CardDescription>Breakdown of platform users by role</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                      </div>
                    ) : (
                      <div className="h-64 flex justify-center">
                        <ResponsiveContainer width="80%" height="100%">
                          <PieChart>
                            <Pie
                              data={userDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {userDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Loan Value by Month */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChartIcon className="h-5 w-5" />
                      <span>Loan Value by Month</span>
                    </CardTitle>
                    <CardDescription>Total value of approved loans (USD)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={loanStats}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Loan Value']} />
                            <Legend />
                            <Bar dataKey="value" name="Loan Value (USD)" fill="#3E92CC" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Platform Health Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <span>Platform Health Summary</span>
                  </CardTitle>
                  <CardDescription>Key performance indicators for TrustBond platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-trustbond-primary">User Engagement</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Active Users:</span>
                          <span className="font-medium">87%</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">KYC Completion Rate:</span>
                          <span className="font-medium">76%</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Loan Application Rate:</span>
                          <span className="font-medium">44%</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-trustbond-primary">System Performance</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Avg. KYC Verification Time:</span>
                          <span className="font-medium">2.4 days</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Avg. Loan Approval Time:</span>
                          <span className="font-medium">3.1 days</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">System Uptime:</span>
                          <span className="font-medium">99.97%</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-trustbond-primary">Financial Metrics</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Loan Approval Rate:</span>
                          <span className="font-medium">81%</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Default Rate:</span>
                          <span className="font-medium">3.2%</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Platform Fee Revenue:</span>
                          <span className="font-medium">$287,500</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline"
                    onClick={() => toast.info("Detailed analytics would be displayed here")}
                    className="w-full"
                  >
                    View Detailed Analytics
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Banks Tab */}
          <TabsContent value="banks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>Bank Management</span>
                </CardTitle>
                <CardDescription>
                  Review and manage financial institutions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trustbond-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Bank Name</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Users Verified</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Loans Processed</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Join Date</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {banks.map((bank) => (
                            <tr key={bank.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <Building2 className="h-5 w-5 mr-2 text-trustbond-primary" />
                                  <div className="font-medium">{bank.name}</div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                {bank.status === "active" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </span>
                                ) : bank.status === "inactive" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactive
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-gray-700">{bank.usersVerified}</td>
                              <td className="py-4 px-4 text-gray-700">{bank.loansProcessed}</td>
                              <td className="py-4 px-4 text-gray-700">{bank.joinDate}</td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2">
                                  {bank.status === "active" ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                      onClick={() => handleBankStatusChange(bank.id, "inactive")}
                                    >
                                      Deactivate
                                    </Button>
                                  ) : bank.status === "inactive" ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-green-600 border-green-600 hover:bg-green-50"
                                      onClick={() => handleBankStatusChange(bank.id, "active")}
                                    >
                                      Activate
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-green-600 border-green-600 hover:bg-green-50"
                                      onClick={() => handleBankStatusChange(bank.id, "active")}
                                    >
                                      Approve
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => toast.info(`Bank details for ${bank.name} would be shown here`)}
                                  >
                                    Details
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Add New Bank</h3>
                      <p className="text-gray-700 mb-4">
                        To add a new financial institution to the platform, you'll need to collect their business details, 
                        regulatory information, and assign admin credentials.
                      </p>
                      <Button 
                        onClick={() => toast.info("Bank onboarding form would be shown here")}
                        className="bg-trustbond-primary hover:bg-trustbond-primary/90"
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        Onboard New Bank
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>System Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage platform configuration and smart contract parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Smart Contract Settings */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-trustbond-dark">Smart Contract Settings</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">KYC Verifier Contract</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Contract Address:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {CONTRACT_ADDRESSES.KYC_VERIFIER}
                            </code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Required Approvers:</span>
                            <span className="font-medium">1</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Verification Fee:</span>
                            <span className="font-medium">25 USDC</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => toast.info("KYC contract management interface would be shown")}
                        >
                          Manage
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Trust Score Contract</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Contract Address:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {CONTRACT_ADDRESSES.TRUST_SCORE}
                            </code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Score Update Cooldown:</span>
                            <span className="font-medium">7 days</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Min Score Threshold:</span>
                            <span className="font-medium">50/100</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => toast.info("Trust Score contract management interface would be shown")}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Loan Manager Contract</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Contract Address:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {CONTRACT_ADDRESSES.LOAN_MANAGER}
                            </code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Min Trust Score:</span>
                            <span className="font-medium">70/100</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Platform Fee:</span>
                            <span className="font-medium">1.5%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Min Loan Amount:</span>
                            <span className="font-medium">500 USDC</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Max Loan Amount:</span>
                            <span className="font-medium">50,000 USDC</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Max Duration:</span>
                            <span className="font-medium">36 months</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => toast.info("Loan contract management interface would be shown")}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>

                  {/* User Management */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-trustbond-dark">User Management</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Role Management</h4>
                        <p className="text-gray-600 mb-4">
                          Assign and manage user roles across the platform.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("Role management interface would be shown")}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Manage Roles
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Admin Access</h4>
                        <p className="text-gray-600 mb-4">
                          Control access rights for platform administrators.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("Admin access interface would be shown")}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Access
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Platform Settings */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-trustbond-dark">Platform Settings</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">KYC Requirements</h4>
                        <p className="text-gray-600 mb-4">
                          Configure required documents and verification steps.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("KYC requirements interface would be shown")}
                        >
                          Configure
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Trust Score Algorithm</h4>
                        <p className="text-gray-600 mb-4">
                          Adjust trust score calculation parameters.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("Trust score algorithm interface would be shown")}
                        >
                          Configure
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Interest Rate Models</h4>
                        <p className="text-gray-600 mb-4">
                          Set base rates and risk adjustments for loans.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info("Interest rate model interface would be shown")}
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* System Maintenance */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-trustbond-dark">System Maintenance</h3>
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Blockchain Status</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-600">Network</p>
                          <p className="font-medium flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Ethereum Mainnet
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-600">Gas Price</p>
                          <p className="font-medium">32 Gwei</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-600">Block Number</p>
                          <p className="font-medium">18,234,657</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-600">Confirmations</p>
                          <p className="font-medium">12</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline"
                        onClick={() => toast.info("System logs would be shown")}
                      >
                        View System Logs
                      </Button>
                      <Button 
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => toast.error("This would trigger emergency pause in a real system")}
                      >
                        Emergency Pause
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

// Constants needed to avoid circular imports
const CONTRACT_ADDRESSES = {
  KYC_VERIFIER: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  TRUST_SCORE: "0x5FbDB2315678afecb367f032d93F642f64180aa4",
  LOAN_MANAGER: "0x5FbDB2315678afecb367f032d93F642f64180aa5",
};
