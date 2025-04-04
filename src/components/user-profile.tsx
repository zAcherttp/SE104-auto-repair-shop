"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Shield,
  Edit,
  Save,
  X,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  // Mock user data - in a real app, you would fetch this based on userId
  const user = {
    id: "u1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    role: "Manager",
    department: "Administration",
    joinDate: "2020-03-15",
    avatar: "https://avatar.iran.liara.run/public",
    permissions: [
      "manage_users",
      "manage_inventory",
      "manage_tasks",
      "manage_invoices",
    ],
    recentActivity: [
      {
        id: "a1",
        action: "Created invoice #INV-001-2023",
        timestamp: "2023-05-12T14:30:00",
      },
      {
        id: "a2",
        action: "Updated customer John Smith",
        timestamp: "2023-05-11T10:15:00",
      },
      {
        id: "a3",
        action: "Assigned task to Mike Johnson",
        timestamp: "2023-05-10T09:45:00",
      },
      {
        id: "a4",
        action: "Added new inventory item",
        timestamp: "2023-05-09T16:20:00",
      },
    ],
  };

  const handleSave = () => {
    // In a real app, you would save the changes to the backend
    setIsEditing(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://avatar.iran.liara.run/public"
              alt="User"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-flex">John Doe</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setProfileOpen(true)}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings/user")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[600px] top-36 translate-y-0">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 py-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.department}
                  </p>
                  <div className="flex justify-center sm:justify-start gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                    {isEditing && (
                      <Button size="sm" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input id="name" defaultValue={user.name} />
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 rounded-md border">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                      />
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 rounded-md border">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input id="phone" defaultValue={user.phone} />
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 rounded-md border">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md border">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    {isEditing ? (
                      <Input id="role" defaultValue={user.role} />
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 rounded-md border">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>{user.role}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input id="department" defaultValue={user.department} />
                    ) : (
                      <div className="flex items-center gap-2 h-10 px-3 rounded-md border">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{user.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {user.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-2 p-2 rounded-md border"
                    >
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="capitalize">
                        {permission.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <div className="space-y-2">
                  {user.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-between p-2 rounded-md border"
                    >
                      <span>{activity.action}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
