
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Mail, Briefcase, Phone, MapPin, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { MultifactorAuth } from "@/components/auth/MultifactorAuth";

export function ProfilePage() {
  const { user } = useAuth();
  const { account } = useBlockchain();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSaveBasic = () => {
    setIsEditingBasic(false);
    toast.success("Basic profile information updated");
  };
  
  const handleSaveContact = () => {
    setIsEditingContact(false);
    toast.success("Contact information updated");
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and security preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-trustbond-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditingBasic ? (
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    ) : (
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        {form.name || "Not provided"}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                      {form.email}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      {form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 font-mono text-sm truncate">
                      {user?.walletAddress || account || "Not connected"}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  {isEditingBasic ? (
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => setIsEditingBasic(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveBasic}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditingBasic(true)}>
                      Edit Basic Information
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-trustbond-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How we can reach you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditingContact ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                      />
                    ) : (
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        {form.phone || "Not provided"}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditingContact ? (
                      <Input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Your address"
                      />
                    ) : (
                      <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {form.address || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  {isEditingContact ? (
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => setIsEditingContact(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveContact}>
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditingContact(true)}>
                      Edit Contact Information
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          {/* Two-Factor Authentication */}
          <MultifactorAuth />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfilePage;
