
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, MoreHorizontal, User, Shield, AlertTriangle, Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock user data
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "user", status: "active", created: "2025-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", status: "active", created: "2025-01-20" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user", status: "inactive", created: "2025-02-05" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "user", status: "active", created: "2025-02-10" },
  { id: 5, name: "First Bank", email: "contact@firstbank.com", role: "bank", status: "active", created: "2025-01-10" },
  { id: 6, name: "National Bank", email: "info@nationalbank.com", role: "bank", status: "active", created: "2025-01-25" },
  { id: 7, name: "Sarah Wilson", email: "sarah@example.com", role: "user", status: "pending", created: "2025-03-01" },
  { id: 8, name: "Michael Clark", email: "michael@example.com", role: "user", status: "active", created: "2025-03-05" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active"
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const id = users.length + 1;
    const created = new Date().toISOString().split('T')[0];
    
    setUsers([...users, { ...newUser, id, created }]);
    setNewUser({ name: "", email: "", role: "user", status: "active" });
    setIsAddUserOpen(false);
    
    toast.success("User added successfully");
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  const handleUserStatusChange = (id: number, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    toast.success("User status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newUser.status} 
                  onValueChange={(value) => setNewUser({...newUser, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select 
                  value={roleFilter} 
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {user.role === "admin" ? (
                              <Shield className="mr-1 h-4 w-4 text-red-500" />
                            ) : user.role === "bank" ? (
                              <Building2 className="mr-1 h-4 w-4 text-blue-500" />
                            ) : (
                              <User className="mr-1 h-4 w-4 text-green-500" />
                            )}
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.status === "active" 
                                ? "default" 
                                : user.status === "inactive" 
                                ? "secondary" 
                                : "outline"
                            }
                            className={
                              user.status === "active" 
                                ? "bg-green-500" 
                                : user.status === "inactive" 
                                ? "bg-gray-500" 
                                : "bg-yellow-500 text-white"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.created}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Select 
                              defaultValue={user.status}
                              onValueChange={(value) => handleUserStatusChange(user.id, value)}
                            >
                              <SelectTrigger className="h-8 w-[110px]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Activate</SelectItem>
                                <SelectItem value="inactive">Deactivate</SelectItem>
                                <SelectItem value="pending">Set Pending</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
