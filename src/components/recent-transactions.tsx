import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: "positive" | "negative";
}

const transactions: Transaction[] = [
  {
    id: "t1",
    name: "Alice Johnson",
    email: "alice@example.com",
    amount: 350.0,
    date: "2023-07-20",
    status: "positive",
  },
  {
    id: "t2",
    name: "Bob Smith",
    email: "bob@example.com",
    amount: 120.5,
    date: "2023-07-19",
    status: "negative",
  },
  {
    id: "t3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    amount: 1000.0,
    date: "2023-07-18",
    status: "positive",
  },
  {
    id: "t4",
    name: "Diana Martinez",
    email: "diana@example.com",
    amount: 50.75,
    date: "2023-07-17",
    status: "negative",
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`/placeholder.svg?height=36&width=36`}
                alt={transaction.name}
              />
              <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {transaction.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.email}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-sm font-medium",
                transaction.status === "positive"
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              {transaction.status === "positive" ? "+" : "-"}$
              {Math.abs(transaction.amount).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">{transaction.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
