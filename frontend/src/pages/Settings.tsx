import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, Lock, User, Globe, Database, Shield } from "lucide-react";

export default function Settings() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your application experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                <span>Language</span>
              </div>
              <Button variant="outline" size="sm">
                English
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>Privacy Settings</span>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your data and export options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 