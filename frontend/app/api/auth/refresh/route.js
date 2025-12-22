import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, createAccessToken } from "@/lib/jwt.js";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refresh = cookieStore.get("refresh")?.value;
console.log("refresh-------> ", refresh);
        if (!refresh) {
            return NextResponse.json({ message: "no refresh token" }, { status: 401 });
        }

        const payload = verifyRefreshToken(refresh);

        // 새 access 토큰 발급
        const newAccess = createAccessToken({ id: payload.id, role: payload.role });

        const res = NextResponse.json(
            { message: "reissued", user: { id: payload.id, role: payload.role } },
            { status: 200 }
        );

        res.cookies.set("access", newAccess, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
        });

        return res;

    } catch (err) {
        console.error("refresh error", err);
        return NextResponse.json({ message: "invalid refresh" }, { status: 401 });
    }
}
