"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore.js";

export default function AuthHydrator() {
    const setUser = useAuthStore((state) => state.setUser);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/auth/me", { credentials: "include" });
                const { user } = await res.json();

                if (user?.authenticated) {
                    console.log("🔄 Hydrator: 새로고침 → Access Token 재발급됨");
                    login({
                        userId: user.userId,
                        role: user.role,
                        // accessToken: data.accessToken,
                    });
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        })();
    }, [setUser]);

    return null;
}
