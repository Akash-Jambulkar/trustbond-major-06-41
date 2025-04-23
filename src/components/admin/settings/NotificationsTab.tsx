
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const NotificationsTab = () => {
  const handleSave = () => {
    toast.success("Notification settings saved")
  }

  return (
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
        
        <Button onClick={handleSave} className="w-full">
          Save Notification Settings
        </Button>
      </CardContent>
    </Card>
  )
}

export default NotificationsTab
