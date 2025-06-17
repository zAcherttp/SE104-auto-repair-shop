import Link from "next/link";
import { Search, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default function HomePage() {
  // Authentication redirects are handled by middleware

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold  mb-4">Auto Repair Shop</h1>
          <p className="text-xl  max-w-2xl mx-auto ">
            Professional automotive services with transparent tracking and
            expert care
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3  rounded-full w-fit">
                <Users className="h-8 w-8 " />
              </div>
              <CardTitle className="text-2xl">Garage Member</CardTitle>
              <CardDescription className="text-base">
                Access the management dashboard to handle orders, customers, and
                operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full text-lg py-6">
                  Continue as Member
                </Button>
              </Link>
              <p className="text-sm mt-3 text-center">
                For staff and administrators only
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 rounded-full w-fit">
                <Search className="h-8 w-8 " />
              </div>
              <CardTitle className="text-2xl">Customer</CardTitle>
              <CardDescription className="text-base">
                Track your vehicle service order and get real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/track-order">
                <Button
                  variant="outline"
                  className="w-full text-lg py-6 border-2"
                >
                  Track My Order
                </Button>
              </Link>
              <p className="text-sm mt-3 text-center">
                Enter your order ID to check status
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
