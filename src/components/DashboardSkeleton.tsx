import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Stat Card Skeleton
export const StatCardSkeleton = () => (
  <Card className="glass-card border-border/30 overflow-hidden">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl" />
      </div>
    </CardContent>
  </Card>
);

// Assignment Card Skeleton
export const AssignmentCardSkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/20">
    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
    <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
  </div>
);

// Course Card Skeleton
export const CourseCardSkeleton = () => (
  <div className="p-4 rounded-xl bg-muted/20 border border-border/20 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

// Activity Card Skeleton
export const ActivityCardSkeleton = () => (
  <div className="flex items-center gap-3 p-2">
    <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-3 w-12" />
  </div>
);

// Circular Progress Skeleton
export const CircularProgressSkeleton = ({ size = 80 }: { size?: number }) => (
  <Skeleton className="rounded-full" style={{ width: size, height: size }} />
);

// Mini Bar Chart Skeleton
export const MiniBarChartSkeleton = () => (
  <div className="flex items-end gap-1 h-12">
    {Array(7).fill(0).map((_, i) => (
      <Skeleton 
        key={i} 
        className="flex-1 rounded-t" 
        style={{ height: `${Math.random() * 60 + 20}%` }} 
      />
    ))}
  </div>
);

// Full Dashboard Skeleton Layout
export const DashboardSkeleton = () => (
  <div className="space-y-6 md:space-y-8 animate-pulse">
    {/* Welcome Section Skeleton */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 md:w-80" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>

    {/* Quick Stats Skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array(4).fill(0).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Tabs Skeleton */}
    <Skeleton className="h-12 w-full rounded-xl" />

    {/* Main Content Grid Skeleton */}
    <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Assignments Card */}
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <AssignmentCardSkeleton key={i} />
            ))}
          </CardContent>
        </Card>

        {/* Courses Card */}
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Progress Card */}
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-6">
              <CircularProgressSkeleton size={100} />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <MiniBarChartSkeleton />
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <ActivityCardSkeleton key={i} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
