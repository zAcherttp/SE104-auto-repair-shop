import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <div className="text-xl font-semibold">Loading Dashboard...</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <CardTitle className="h-4 bg-gray-300 rounded w-3/4"></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </CardContent>
    </Card>
  );
}
