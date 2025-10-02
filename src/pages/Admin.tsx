import { useAdmin } from '@/hooks/useAdmin';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, GraduationCap, FileText, Users, Shield, UserCircle } from 'lucide-react';
import LibraryItemsManager from '@/components/admin/LibraryItemsManager';
import UniversityCoursesManager from '@/components/admin/UniversityCoursesManager';
import AssignmentTemplatesManager from '@/components/admin/AssignmentTemplatesManager';
import UserRolesManager from '@/components/admin/UserRolesManager';
import SecurityAuditViewer from '@/components/admin/SecurityAuditViewer';
import UserProfilesViewer from '@/components/admin/UserProfilesViewer';

const Admin = () => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage system data and user roles</p>
        </div>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="library" className="gap-2">
              <Library className="h-4 w-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="profiles" className="gap-2">
              <UserCircle className="h-4 w-4" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Shield className="h-4 w-4" />
              Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <LibraryItemsManager />
          </TabsContent>

          <TabsContent value="courses">
            <UniversityCoursesManager />
          </TabsContent>

          <TabsContent value="templates">
            <AssignmentTemplatesManager />
          </TabsContent>

          <TabsContent value="users">
            <UserRolesManager />
          </TabsContent>

          <TabsContent value="profiles">
            <UserProfilesViewer />
          </TabsContent>

          <TabsContent value="audit">
            <SecurityAuditViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
