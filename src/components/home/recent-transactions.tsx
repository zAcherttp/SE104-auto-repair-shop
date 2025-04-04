import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface Transaction {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
}

const transactions: Transaction[] = [
  {
    id: "t1",
    name: "Alice Johnson",
    email: "alice@example.com",
    amount: 350.0,
    date: "2023-07-20",
  },
  {
    id: "t2",
    name: "Bob Smith",
    email: "bob@example.com",
    amount: 120.5,
    date: "2023-07-19",
  },
  {
    id: "t3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    amount: 1000.0,
    date: "2023-07-18",
  },
  {
    id: "t4",
    name: "Diana Martinez",
    email: "diana@example.com",
    amount: -50.75,
    date: "2023-07-17",
  },
];

export function RecentTransactions() {
  return (
    <div className="flex h-full space-y-4 p-4 pt-0 pb-0">
      <Card className="p-0 w-full rounded-lg inset-shadow-sm shadow-none ">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg p-3 pr-10 pl-5 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://avatar.iran.liara.run/username?username=${transaction.name
                    .toLowerCase()
                    .replace(/\s+/g, "+")}`}
                  alt={transaction.name}
                />
                <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground leading-none">
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
                  transaction.amount > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {transaction.amount > 0 ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {transaction.date}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
