
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useKYCStatus } from "@/hooks/useKYCStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Check, 
  Pencil, 
  Loader2
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const { account, isConnected } = useBlockchain();
  const { kycStatus, isVerified, verificationTimestamp } = useKYCStatus();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call to update profile
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Not verified";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Profile</h1>
        {!isEditing ? (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1"
          >
            <Pencil size={16} /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check size={16} /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-trustbond-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your personal details used for identification and communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-slate-50">{user?.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-slate-50 flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    {user?.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-slate-50 flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    {user?.phone || "Not provided"}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="p-2 border rounded-md bg-slate-50">
                    {user?.address || "Not provided"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Blockchain Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.75L5.75 4.5V15.5C5.75 15.5 5.94 18.332 9.5 20.75C13 18.5 13.5 16 13.25 15.5V4.5L7 1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8L18 9V14.5L16 16L14 14.5V9L16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Blockchain Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConnected ? (
              <>
                <div className="space-y-1">
                  <Label className="text-xs">Connected Wallet</Label>
                  <div className="p-2 border rounded-md bg-slate-50 font-mono text-xs break-all">
                    {account}
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Wallet Connected
                </Badge>
              </>
            ) : (
              <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Wallet not connected</AlertTitle>
                <AlertDescription>
                  Connect your blockchain wallet to submit KYC documents and apply for loans.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        {/* KYC Verification Status */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-trustbond-primary" />
              KYC Verification Status
            </CardTitle>
            <CardDescription>
              Your document verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isVerified ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Not Verified</Badge>
                )}
                {verificationTimestamp && (
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date(verificationTimestamp).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              {isVerified ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-green-800">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <p className="font-medium">Your identity has been verified</p>
                  </div>
                  <p className="text-sm mt-1 text-green-700">
                    Your documents have been securely verified and the verification status 
                    is recorded on the blockchain. You now have full access to all platform features.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" />
                    <p className="font-medium">KYC verification required</p>
                  </div>
                  <p className="text-sm mt-1 text-amber-700">
                    Please complete KYC verification to access all platform features. 
                    Visit the KYC page to submit your documents.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 gap-2 flex flex-col items-start text-xs text-muted-foreground">
            <p className="flex items-center gap-1">
              <ShieldCheck size={12} /> Your verified documents are securely stored with only their hashes on the blockchain.
            </p>
            <p className="flex items-center gap-1">
              <Calendar size={12} /> Document verification may take up to 48 hours after submission.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
