"use client";

import { useAuth } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const SyncButton = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/api/products/sync`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                toast.success("Products synced successfully!");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast.error("Failed to sync products.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during sync.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync with Stripe"}
        </button>
    );
};
