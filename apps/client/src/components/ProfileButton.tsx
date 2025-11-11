"use client"

import { UserButton } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
    const router = useRouter();
    return (
        <UserButton>
            <UserButton.MenuItems>
                <UserButton.Action labelIcon={<ShoppingBag className="w-4 h-4" />} label="See Orders" onClick={() => router.push('/orders')} />
            </UserButton.MenuItems>
        </UserButton>
    )
}

export default ProfileButton;