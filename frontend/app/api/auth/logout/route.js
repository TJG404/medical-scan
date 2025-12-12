import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt.js";

export async function POST() {
    try {
        const response = NextResponse.json({ message: "logout success" }, { status: 200 });

        // 로그인 시 설정값 맞추기
        const commonOptions = {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",          // 로그인 때도 path: "/"로 설정했다면 동일하게
        };

        // access, refresh 둘 다 즉시 만료
        response.cookies.set("access", "", { ...commonOptions, maxAge: 0 });
        response.cookies.set("refresh", "", { ...commonOptions, maxAge: 0 });

        return response;

    } catch (err) {
        console.log("me error", err);
        // access 토큰 만료 등
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
