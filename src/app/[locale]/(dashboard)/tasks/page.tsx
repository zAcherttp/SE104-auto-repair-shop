import TaskContainer from "@/src/components/tasks/task-container";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function OrdersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskContainer />
    </HydrationBoundary>
  );
}
