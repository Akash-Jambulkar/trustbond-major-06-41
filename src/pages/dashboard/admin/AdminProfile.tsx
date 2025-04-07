
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Shield, User } from "lucide-react";

const AdminProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // For a real app, we would fetch from database
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    role: user?.role || "admin",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would update the profile in the database
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Input 
                  id="role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  disabled={true} 
                />
              </div>
              
              {isEditing && (
                <Button type="submit" className="w-full">Save Changes</Button>
              )}
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password regularly
                </p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Active Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your active login sessions
                </p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrative Privileges</CardTitle>
          <CardDescription>Your admin access roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium">User Management</h3>
                <p className="text-xs text-muted-foreground">Full access</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium">Bank Management</h3>
                <p className="text-xs text-muted-foreground">Full access</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium">System Configuration</h3>
                <p className="text-xs text-muted-foreground">Full access</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium">Blockchain Management</h3>
                <p className="text-xs text-muted-foreground">Full access</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium">Analytics & Reporting</h3>
                <p className="text-xs text-muted-foreground">Full access</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium">Security Audit</h3>
                <p className="text-xs text-muted-foreground">Full access</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
