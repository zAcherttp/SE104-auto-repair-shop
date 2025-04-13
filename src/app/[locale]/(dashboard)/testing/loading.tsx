import { LoaderIcon } from "lucide-react";

export default function HomeLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderIcon className="h-6 w-6 animate-spin text-gray-500" />
    </div>
  );
}
