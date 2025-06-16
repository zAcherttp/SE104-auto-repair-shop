"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"

// Mock data for demonstration
const mockOrders = {
    "ORD-001": {
        id: "ORD-001",
        customerName: "John Doe",
        vehicle: "2020 Honda Civic",
        service: "Oil Change & Brake Inspection",
        status: "completed" as const,
        dateCreated: "2024-01-15",
        estimatedCompletion: "2024-01-16",
        totalCost: "$89.99",
        description: "Regular maintenance service including oil change and comprehensive brake system inspection.",
    },
    "ORD-002": {
        id: "ORD-002",
        customerName: "Jane Smith",
        vehicle: "2019 Toyota Camry",
        service: "Engine Diagnostic & Repair",
        status: "in progress" as const,
        dateCreated: "2024-01-16",
        estimatedCompletion: "2024-01-18",
        totalCost: "$245.00",
        description: "Diagnostic testing revealed faulty oxygen sensor. Replacement in progress.",
    },
    "ORD-003": {
        id: "ORD-003",
        customerName: "Mike Johnson",
        vehicle: "2021 Ford F-150",
        service: "Tire Replacement",
        status: "pending" as const,
        dateCreated: "2024-01-17",
        estimatedCompletion: "2024-01-19",
        totalCost: "$320.00",
        description: "Full set of tire replacement scheduled. Waiting for tire delivery.",
    },
}

export default function TrackOrderPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResult, setSearchResult] = useState<typeof mockOrders[keyof typeof mockOrders] | null>(null)

    const handleOrderSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const order = mockOrders[searchQuery.toUpperCase() as keyof typeof mockOrders]
        setSearchResult(order || null)
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-2xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Track Your Order</CardTitle>
                        <CardDescription>Enter your order ID to check the current status and details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleOrderSearch} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="orderId">Order ID</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="orderId"
                                        type="text"
                                        placeholder="e.g., ORD-001"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        required
                                    />
                                    <Button type="submit">
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {searchResult && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Order Details</CardTitle>
                                <Badge>
                                    {searchResult.status.charAt(0).toUpperCase() + searchResult.status.slice(1)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Order ID</Label>
                                    <p className="font-mono">{searchResult.id}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Customer</Label>
                                    <p>{searchResult.customerName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Vehicle</Label>
                                    <p>{searchResult.vehicle}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Total Cost</Label>
                                    <p className="font-semibold">{searchResult.totalCost}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Date Created</Label>
                                    <p>{searchResult.dateCreated}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Est. Completion</Label>
                                    <p>{searchResult.estimatedCompletion}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <Label className="text-sm font-medium">Service</Label>
                                <p className="font-medium">{searchResult.service}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Description</Label>
                                <p>{searchResult.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {searchQuery && !searchResult && searchQuery.length > 0 && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p>
                                No order found with ID: <code className="px-1 rounded">{searchQuery}</code>
                            </p>
                            <p className="text-sm mt-2">Try: ORD-001, ORD-002, or ORD-003 for demo</p>
                        </CardContent>
                    </Card>
                )}

                <Card className="mt-6">
                    <CardContent className="pt-6">
                        <h3 className="font-medium mb-2">Demo Order IDs:</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(mockOrders).map((orderId) => (
                                <Button key={orderId} variant="outline" size="sm" onClick={() => setSearchQuery(orderId)}>
                                    {orderId}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
