import { fetchInventoryStatus } from "@/src/app/action/home";
import { fetchOrders } from "@/src/app/action/orders";
import TaskContainer from "@/src/components/tasks/task-container";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function OrdersPage() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["tasks"],
      queryFn: fetchOrders,
    }),
    // queryClient.prefetchQuery({
    //   queryKey: ["orders"],
    //   queryFn: fetchInventoryStatus
    // })
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskContainer />
    </HydrationBoundary>
  );
}
