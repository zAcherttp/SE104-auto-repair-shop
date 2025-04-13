import { fetchOrders } from "@/src/app/action/orders";
import OrdersContainer from "@/src/components/tasks/order-container";

export default async function OrdersPage() {
  const initialOrders = await fetchOrders();

  return <OrdersContainer initialOrders={initialOrders} />;
}
