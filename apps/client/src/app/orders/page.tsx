import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@repo/types";
import { Package, Calendar, Tag, CreditCard, ShoppingBag } from "lucide-react";

const fetchOrders = async () => {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { revalidate: 0 } // Ensure fresh data
        }
    );

    if (!res.ok) return [];
    const data: OrderType[] = await res.json();
    return Array.isArray(data) ? data : [];
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        cancelled: "bg-rose-100 text-rose-700 border-rose-200",
        processing: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const currentStyle = styles[status.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${currentStyle}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const OrdersPage = async () => {
    const orders = await fetchOrders();

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200">
                    <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Orders</h1>
                    <p className="text-gray-500 text-sm">Manage and track your recent purchases</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
                    <a href="/products" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all">
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                            <div className="p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Order ID</span>
                                            <span className="text-sm font-mono font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded">#{order._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Placed On</span>
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Tag className="w-4 h-4 text-emerald-500" />
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Items Ordered</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {order.products?.map((product, idx) => (
                                                <span key={idx} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg font-medium border border-emerald-100">
                                                    {product.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Payment</span>
                                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                                                <CreditCard className="w-4 h-4" />
                                                <span>Paid</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">Total Amount</span>
                                            <span className="text-xl font-black text-gray-900">${(order.amount / 100).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
