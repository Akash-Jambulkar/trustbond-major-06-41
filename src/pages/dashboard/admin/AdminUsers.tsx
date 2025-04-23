
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  User, 
  Users, 
  Shield, 
  Building, 
  Clock, 
  MoreHorizontal, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// Define a simpler UserRole type to avoid potential import issues
interface UserRole {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  role: string;
  created_at: string;
}

// Create a standalone service for user roles
const userRoleService = {
  getAllUserRoles: async (): Promise<UserRole[]> => {
    try {
      // First get user roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_role_assignments')
        .select('id, user_id, role, created_at');
      
      if (roleError) throw roleError;
      
      // Then get user profiles for additional information
      const userIds = roleData.map(role => role.user_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Merge the data
      const usersWithRoles: UserRole[] = roleData.map(role => {
        const profile = profilesData.find(p => p.user_id === role.user_id) || {};
        return {
          id: role.id,
          user_id: role.user_id,
          email: profile.email,
          full_name: profile.full_name,
          role: role.role,
          created_at: role.created_at
        };
      });
      
      return usersWithRoles;
    } catch (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }
  },

  updateUserRole: async (userId: string, role: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_role_assignments')
        .update({ role })
        .eq('user_id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  }
};

const AdminUsers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserRole[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRole[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'bank' | 'admin'>("user");
  const [isRoleUpdateInProgress, setIsRoleUpdateInProgress] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await userRoleService.getAllUserRoles();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch users",
        description: "There was an error retrieving user data from the database."
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        user => 
          ((user.email || "").toLowerCase()).includes(searchTerm.toLowerCase()) ||
          ((user.full_name || "").toLowerCase()).includes(searchTerm.toLowerCase()) ||
          ((user.role || "").toLowerCase()).includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 flex items-center gap-1">
          <Shield className="h-3 w-3" /> Admin
        </Badge>;
      case 'bank':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 flex items-center gap-1">
          <Building className="h-3 w-3" /> Bank
        </Badge>;
      case 'user':
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-300 flex items-center gap-1">
          <User className="h-3 w-3" /> User
        </Badge>;
    }
  };

  const handleEditRole = (user: UserRole) => {
    setSelectedUser(user);
    setSelectedRole(user.role as 'user' | 'bank' | 'admin');
    setIsEditRoleOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    setIsRoleUpdateInProgress(true);
    try {
      await userRoleService.updateUserRole(selectedUser.user_id, selectedRole);
      toast({
        title: "Role Updated",
        description: `User ${selectedUser.email} role updated to ${selectedRole}.`,
      });
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating the user role."
      });
    } finally {
      setIsRoleUpdateInProgress(false);
      setIsEditRoleOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-gray-500">
          View and manage all users in the system
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user accounts and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4 relative">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by email, name, or role..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              className="ml-2 flex items-center gap-1" 
              variant="outline"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center">
                        <Clock className="h-8 w-8 animate-spin text-trustbond-primary" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {searchTerm ? (
                        <p className="text-sm text-gray-500">No users match your search criteria.</p>
                      ) : (
                        <div>
                          <Users className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">No users found in the system.</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.email || "—"}</div>
                      </TableCell>
                      <TableCell>{user.full_name || "—"}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{format(new Date(user.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRole(user)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Edit user</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role and permissions for this user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">User</h4>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{selectedUser.email || selectedUser.user_id}</span>
                </div>
                {selectedUser.full_name && (
                  <p className="text-sm text-gray-500 ml-6">{selectedUser.full_name}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Current Role</h4>
                <div>{getRoleBadge(selectedUser.role)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">New Role</h4>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'user' | 'bank' | 'admin')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-sm text-amber-800">
                <p className="font-medium">Role Change Implications:</p>
                <ul className="list-disc list-inside mt-1 text-amber-700">
                  <li>User access will be updated immediately</li>
                  <li>Dashboard and permission changes take effect on next login</li>
                  {selectedRole === 'bank' && (
                    <li>Bank role should only be given to verified financial institutions</li>
                  )}
                  {selectedRole === 'admin' && (
                    <li>Admin role grants full system access and should be assigned carefully</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)} disabled={isRoleUpdateInProgress}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateRole}
              disabled={isRoleUpdateInProgress || selectedUser?.role === selectedRole}
            >
              {isRoleUpdateInProgress ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
