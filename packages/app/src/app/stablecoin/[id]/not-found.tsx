import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StablecoinNotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center max-w-7xl">
      <h1 className="text-4xl font-bold text-white mb-4">Stablecoin Not Found</h1>
      <p className="text-neutral-400 max-w-md mb-8">
        The stablecoin you're looking for doesn't exist or has been removed from our database.
      </p>
      <Button asChild>
        <Link href="/stablecoins">
          View All Stablecoins
        </Link>
      </Button>
    </div>
  );
} 