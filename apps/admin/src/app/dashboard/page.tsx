import AppBarChart from "@/components/AppBarChart";
import AppAreaChart from "@/components/AppAreaChart";
import CardList from "@/components/CardList";
import SummaryCards from "@/components/SummaryCards";
import { auth } from "@clerk/nextjs/server";

const Homepage = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  
  const orderChartDataPromise = fetch(
    `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/api/order-chart`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());

  return (
    <div className="flex flex-col gap-6">
      {/* Top Row: Key Metrics */}
      <SummaryCards />

      {/* Middle Row: Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-primary-foreground p-6 rounded-xl border border-border/50 shadow-sm">
          <AppBarChart dataPromise={orderChartDataPromise} />
        </div>
        <div className="bg-primary-foreground p-6 rounded-xl border border-border/50 shadow-sm">
          <CardList title="Latest Transactions" />
        </div>
      </div>

      {/* Bottom Row: Visitors and Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-primary-foreground p-6 rounded-xl border border-border/50 shadow-sm">
          <AppAreaChart />
        </div>
        <div className="bg-primary-foreground p-6 rounded-xl border border-border/50 shadow-sm">
          <CardList title="Popular Products" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
