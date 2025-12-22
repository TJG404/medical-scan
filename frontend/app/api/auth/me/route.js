import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt.js";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const payload = verifyAccessToken(token);

        return NextResponse.json(
            { user: { id: payload.id, role: payload.role, authenticated:true } },
            { status: 200 }
        );

    } catch (err) {
        console.log("me error", err);
        // access 토큰 만료 - status 401
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
