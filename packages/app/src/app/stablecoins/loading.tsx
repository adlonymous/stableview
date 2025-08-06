import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StablecoinsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <StablecoinCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function StablecoinCardSkeleton() {
  return (
    <Card className="overflow-hidden border-neutral-800 bg-neutral-900">
      <CardHeader className="pb-1 px-4 pt-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-5 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-20 ml-auto" />
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-4 pt-2">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-10 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
} 