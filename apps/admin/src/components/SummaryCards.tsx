import { auth } from "@clerk/nextjs/server";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const SummaryCards = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  // Fetch all required data in parallel
  const [usersRes, productsRes, ordersRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/api/products`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/api/orders?limit=10000`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
  ]);

  const users = usersRes.ok ? await usersRes.json() : [];
  const products = productsRes.ok ? await productsRes.json() : [];
  const orders = ordersRes.ok ? await ordersRes.json() : [];

  // Calculate metrics
  const totalUsers = users.data ? users.data.length : users.length || 0; // handle depending on clerk format
  const totalProducts = products.length || 0;
  const totalOrders = orders.length || 0;
  
  // Orders usually have an amount in cents
  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + (order.amount || 0),
    0
  );

  const metrics = [
    {
      title: "Total Revenue",
      value: `$${(totalRevenue / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Lifetime earnings",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Total successful orders",
    },
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Active products in store",
    },
    {
      title: "Active Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: "Registered customers",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="relative overflow-hidden border-border/50 bg-primary-foreground/50 backdrop-blur-xl transition-all hover:shadow-md hover:border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${metric.bg}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
            {/* Subtle gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${metric.color.replace('text-', '')}/5 pointer-events-none`} />
          </Card>
        );
      })}
    </div>
  );
};

export default SummaryCards;
