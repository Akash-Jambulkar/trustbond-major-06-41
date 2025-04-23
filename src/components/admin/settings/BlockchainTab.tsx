
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useMode } from "@/contexts/ModeContext"

const BlockchainTab = () => {
  const { enableBlockchain, toggleBlockchain } = useMode()

  return (
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
  )
}

export default BlockchainTab
