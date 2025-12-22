"use client";

import { useAuthStore } from "@/store/authStore.js";
import AuthHydrator from "@/app/provider/AuthHydrator.jsx";
import Header from "@/components/commons/Header.jsx";
import Footer from "@/components/commons/Footer.jsx";

export default function AppShell({ children }) {
    const authChecked = useAuthStore((s) => s.authChecked);

    return (
        <>
            <AuthHydrator />
            {!authChecked ? (
                <div className="app-loading">
                    {/* 로딩 UI 넣기 */}
                    {/*<p style={{textAlign:"center", paddingTop: "50px"}}></p>*/}
                </div>
            ) : (
                <>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </>
            )}
        </>
    );
}