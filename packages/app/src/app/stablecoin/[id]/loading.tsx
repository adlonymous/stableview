import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StablecoinLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 md:ml-auto">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0 mt-0.5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0 mt-0.5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader className="pb-1 px-4 pt-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-lg shrink-0 mt-0.5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="px-5 pt-4 pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <div>
        <Skeleton className="h-10 w-full mb-4" />
        <Card className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-4 px-5 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 