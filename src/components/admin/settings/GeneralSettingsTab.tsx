
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const GeneralSettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage application-wide settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-medium">System Status</h3>
            <p className="text-sm text-muted-foreground">
              Current system operational status
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-green-600">Running</span>
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
  )
}

export default GeneralSettingsTab
