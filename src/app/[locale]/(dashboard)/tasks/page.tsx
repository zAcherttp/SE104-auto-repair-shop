import { unstable_noStore } from "next/cache";

export default async function TasksPage() {
  unstable_noStore();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <p className="text-gray-500">This is the tasks page.</p>
    </div>
  );
}
