
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GeneralSettingsTab from "@/components/admin/settings/GeneralSettingsTab"
import BlockchainTab from "@/components/admin/settings/BlockchainTab"
import NotificationsTab from "@/components/admin/settings/NotificationsTab"
import ApiIntegrationTab from "@/components/admin/settings/ApiIntegrationTab"

const AdminSettings = () => {
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
          <GeneralSettingsTab />
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <ApiIntegrationTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminSettings
