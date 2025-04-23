
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const ApiIntegrationTab = () => {
  const handleSave = () => {
    toast.success("API settings saved")
  }

  return (
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
        
        <Button onClick={handleSave} className="w-full">
          Save API Settings
        </Button>
      </CardContent>
    </Card>
  )
}

export default ApiIntegrationTab
