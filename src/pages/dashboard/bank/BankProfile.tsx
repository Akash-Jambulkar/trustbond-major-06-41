
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Building2, Landmark, MapPin, User } from "lucide-react";

const BankProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // For a real app, we would fetch from database
  const [formData, setFormData] = useState({
    name: user?.name || "First National Bank",
    email: user?.email || "contact@firstnational.com",
    phone: "+1 (555) 123-4567",
    address: "123 Financial Ave, Banking District",
    city: "Finance City",
    state: "CA",
    zip: "90210",
    licenseNumber: "BNK-123456-XYZ",
    description: "First National Bank is a leading financial institution providing a wide range of banking services to individuals and businesses.",
    website: "https://firstnational.com"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <h1 className="text-3xl font-bold tracking-tight">Bank Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bank Information</CardTitle>
            <CardDescription>Your institution details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bank Name</Label>
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
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Banking License Number</Label>
                <Input 
                  id="licenseNumber" 
                  name="licenseNumber" 
                  value={formData.licenseNumber} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Bank Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  rows={4}
                  value={formData.description} 
                  onChange={handleChange}
                  disabled={!isEditing} 
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
            <CardTitle>Address Information</CardTitle>
            <CardDescription>Your physical location details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    disabled={!isEditing} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    disabled={!isEditing} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input 
                  id="zip" 
                  name="zip" 
                  value={formData.zip} 
                  onChange={handleChange}
                  disabled={!isEditing} 
                />
              </div>
            </form>

            <div className="mt-6 rounded-md border p-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Bank Location</span>
              </div>
              <div className="mt-2 h-40 bg-muted rounded-md flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Map would be displayed here</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banking Services</CardTitle>
          <CardDescription>Services offered by your institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Landmark className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="text-sm font-medium">Personal Banking</h3>
                <p className="text-xs text-muted-foreground">Accounts, cards, loans</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="text-sm font-medium">Business Banking</h3>
                <p className="text-xs text-muted-foreground">Business loans, accounts</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="text-sm font-medium">Trust Verification</h3>
                <p className="text-xs text-muted-foreground">KYC, credit scoring</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-md border p-3">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="text-sm font-medium">Loan Management</h3>
                <p className="text-xs text-muted-foreground">Smart contract loans</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankProfile;
