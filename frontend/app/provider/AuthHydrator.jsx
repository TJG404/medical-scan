"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore.js";

export default function AuthHydrator() {
    const setUser = useAuthStore((state) => state.setUser);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        let canceled = false;

        (async () => {
            try {
                let res = await fetch("/api/auth/me", { credentials: "include" });
                if(res.status === 401) {    //access 토큰 만료 시
                    const r = await fetch("/api/auth/refresh", {
                        method: "POST",
                        credentials: "include",
                    });

                    if (!r.ok) {
                        if (!canceled) logout();
                        return;
                    }
                    // refresh 성공 → me 다시
                    res = await fetch("/api/auth/me", { credentials: "include" });
                }

                // 3) me 최종 처리 (401이 아니더라도 ok 체크)
                if (!res.ok) {
                    if (!canceled) logout();
                    return;
                }

                const data = await res.json();
                const user = data?.user;
                if (user?.authenticated) {
                    if (!canceled) {
                        login({ userId: user.id, role: user.role });
                    }
                } else {
                    if (!canceled) logout();
                }

            } catch {
                logout();
            }
        })();
    }, [setUser]);

    return null;
}
