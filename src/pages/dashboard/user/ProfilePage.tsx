import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { User, Mail, Phone, Building, MapPin, Shield, Bell, Key, Wallet } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const { account, isConnected } = useBlockchain();
  
  const [profile, setProfile] = useState({
    name: user?.name || "User Name",
    email: user?.email || "user@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Bangalore, Karnataka",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    country: "India"
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    loans: true,
    marketing: false
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };
  
  const saveProfile = () => {
    // In a real app, this would call an API
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveProfile} className="bg-trustbond-primary">
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center pt-4">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg" alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-1">Role: {user?.role}</p>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-2 text-left">
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Wallet Address:</span>
                </div>
                <div className="text-sm font-mono break-all">
                  {isConnected ? account : "No wallet connected"}
                </div>
                
                {!isConnected && (
                  <p className="text-xs text-amber-600 mt-1">
                    Please connect your wallet to access all features
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <Input 
                            id="name" 
                            value={profile.name} 
                            onChange={(e) => handleProfileChange('name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <Input 
                            id="email" 
                            type="email" 
                            value={profile.email} 
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <Input 
                            id="phone" 
                            value={profile.phone} 
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Address</CardTitle>
                    <CardDescription>
                      Your current residential address
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <Input 
                          id="address" 
                          value={profile.address} 
                          onChange={(e) => handleProfileChange('address', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-400" />
                          <Input 
                            id="city" 
                            value={profile.city} 
                            onChange={(e) => handleProfileChange('city', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          value={profile.state} 
                          onChange={(e) => handleProfileChange('state', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input 
                          id="pincode" 
                          value={profile.pincode} 
                          onChange={(e) => handleProfileChange('pincode', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          value={profile.country} 
                          onChange={(e) => handleProfileChange('country', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-2 text-gray-400" />
                        <Input 
                          id="current-password" 
                          type="password" 
                          placeholder="••••••••"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          placeholder="••••••••"
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          placeholder="••••••••"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <Button variant="outline" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">Connected Wallet</div>
                        <div className="text-sm text-gray-500">
                          Current connected wallet: {isConnected ? `${account?.substring(0, 6)}...${account?.substring(account.length - 4)}` : "None"}
                        </div>
                      </div>
                      <Button variant="outline" className="flex items-center">
                        <Wallet className="h-4 w-4 mr-2" />
                        {isConnected ? "Disconnect" : "Connect Wallet"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how we contact you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Email Notifications</div>
                          <div className="text-xs text-gray-500">
                            Receive emails about account activity
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Push Notifications</div>
                          <div className="text-xs text-gray-500">
                            Receive push notifications in your browser
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.push} 
                        onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Loan Updates</div>
                          <div className="text-xs text-gray-500">
                            Receive notifications about your loan applications and payments
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.loans} 
                        onCheckedChange={(checked) => handleNotificationChange('loans', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Marketing Communications</div>
                          <div className="text-xs text-gray-500">
                            Receive updates about new features and promotions
                          </div>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications.marketing} 
                        onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter>
                      <Button onClick={saveProfile} className="ml-auto bg-trustbond-primary">
                        Save Notification Preferences
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;
