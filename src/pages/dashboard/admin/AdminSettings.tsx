import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMode } from "@/contexts/ModeContext";
import { toast } from "sonner";

const AdminSettings = () => {
  const { mode, enableBlockchain, toggleBlockchain, setProductionMode } = useMode();

  const handleSaveNotificationSettings = () => {
    toast.success("Notification settings saved");
  };

  const handleSaveApiSettings = () => {
    toast.success("API settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <Button>Reset to Defaults</Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API & Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage application-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-medium">System Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    The application is running in production mode
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="mode-toggle" className="text-sm">
                    Production
                  </Label>
                  <Switch 
                    id="mode-toggle" 
                    checked={true}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-medium">Maintenance Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Take the system offline for maintenance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="maintenance-toggle" className="text-sm">Off</Label>
                  <Switch id="maintenance-toggle" />
                </div>
              </div>

              <div className="flex items-center justify-between pb-3">
                <div>
                  <h3 className="text-sm font-medium">Debug Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging and debugging information
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="debug-toggle" className="text-sm">Off</Label>
                  <Switch id="debug-toggle" />
                </div>
              </div>
              
              <Button className="w-full">Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Settings</CardTitle>
              <CardDescription>Configure blockchain integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-medium">Blockchain Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable blockchain features
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="blockchain-toggle" className="text-sm">
                    {enableBlockchain ? "Enabled" : "Disabled"}
                  </Label>
                  <Switch 
                    id="blockchain-toggle" 
                    checked={enableBlockchain}
                    onCheckedChange={toggleBlockchain}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="network-select">Blockchain Network</Label>
                <Select defaultValue="testnet">
                  <SelectTrigger id="network-select">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mainnet">Mainnet</SelectItem>
                    <SelectItem value="testnet">Testnet</SelectItem>
                    <SelectItem value="local">Local Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gas-price">Default Gas Price (Gwei)</Label>
                <Input id="gas-price" type="number" defaultValue="5" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gas-limit">Default Gas Limit</Label>
                <Input id="gas-limit" type="number" defaultValue="300000" />
              </div>

              <Button className="w-full">Save Blockchain Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Send important notifications via email
                  </p>
                </div>
                <Switch id="email-toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-medium">SMS Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Send critical alerts via SMS
                  </p>
                </div>
                <Switch id="sms-toggle" />
              </div>

              <div className="flex items-center justify-between pb-3">
                <div>
                  <h3 className="text-sm font-medium">In-App Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Show notifications within the application
                  </p>
                </div>
                <Switch id="in-app-toggle" defaultChecked />
              </div>
              
              <Button onClick={handleSaveNotificationSettings} className="w-full">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API & Integration Settings</CardTitle>
              <CardDescription>Configure third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" type="password" value="sk_test_123456789abcdef" readOnly />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key gives access to all services. Keep it confidential.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" type="url" placeholder="https://your-server.com/webhook" />
              </div>

              <div className="flex items-center justify-between border-b pb-3 pt-2">
                <div>
                  <h3 className="text-sm font-medium">Third-Party API Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow external services to access your API
                  </p>
                </div>
                <Switch id="third-party-toggle" />
              </div>

              <div className="flex items-center justify-between pb-3">
                <div>
                  <h3 className="text-sm font-medium">Rate Limiting</h3>
                  <p className="text-sm text-muted-foreground">
                    Limit API requests per minute
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input id="rate-limit" type="number" defaultValue="60" className="w-16" />
                  <span className="text-sm text-muted-foreground">req/min</span>
                </div>
              </div>
              
              <Button onClick={handleSaveApiSettings} className="w-full">
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
