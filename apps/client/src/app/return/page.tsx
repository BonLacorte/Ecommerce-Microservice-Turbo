"use client";

import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const ReturnPage = ({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string }> | undefined;
}) => {
    const params = searchParams ? use(searchParams) : { session_id: "" };
    const session_id = params.session_id;
    const [data, setData] = useState({ status: "loading", paymentStatus: "loading" });

    useEffect(() => {
        if (!session_id) return;
        
        fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`)
            .then(res => res.json())
            .then(setData)
            .catch(err => {
                console.error("Error fetching session:", err);
                setData({ status: "error", paymentStatus: "error" });
            });
    }, [session_id]);

    if (!session_id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="p-4 bg-red-50 rounded-full text-red-500">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">No session ID found!</h1>
                <p className="text-gray-500">We couldn't find your order session. If you think this is a mistake, please contact support.</p>
                <Link href="/" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all">Return Home</Link>
            </div>
        );
    }

    if (data.status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-8">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 flex flex-col items-center text-white relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShoppingBag className="w-24 h-24 rotate-12" />
                    </div>
                    <div className="bg-white/20 p-5 rounded-full backdrop-blur-md mb-6 shadow-xl animate-bounce-subtle">
                        <CheckCircle2 className="w-16 h-16" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Order Confirmed!</h1>
                    <p className="text-emerald-50/80 text-center text-sm leading-relaxed max-w-[250px]">
                        Your payment was processed successfully. Thank you for choosing TrendCosta.
                    </p>
                </div>

                <div className="p-10 space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-400 text-sm font-medium">Payment Status</span>
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                {data.paymentStatus}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
                            <span className="text-gray-400 text-sm font-medium">Order Reference</span>
                            <span className="text-gray-900 text-xs font-bold font-mono">
                                #{session_id.slice(-8).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-2">
                        <Link 
                            href="/orders" 
                            className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4.5 rounded-2xl font-bold hover:bg-black transition-all hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-[0.98]"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Track Your Order
                        </Link>
                        <Link 
                            href="/" 
                            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-100 text-gray-600 py-4.5 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-50/50 p-6 text-center border-t border-gray-50">
                    <p className="text-xs text-gray-400">
                        Confirmation email sent to your inbox. <br/>
                        Need help? <Link href="/support" className="text-emerald-600 font-bold hover:underline">Contact us</Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ReturnPage;
