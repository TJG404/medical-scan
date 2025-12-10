import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db.js';
import { createAccessToken, createRefreshToken } from "@/lib/jwt.js";
import bcrypt from "bcrypt";

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, pwd } = body;
        const db = getDB();
        const [rows] = await db.execute(
            ` select count(*) as count, id, role 
                from users 
                where id=? and pwd=? 
                group by id, role
            `,
            [id, pwd]
        );

        const data = rows[0];
        const loginResult = rows.length > 0;

        if(!loginResult) {
            return NextResponse.json({ data });
        }

        const accessToken = await createAccessToken({id:data.id, role:data.role});
        const refreshToken = await createRefreshToken({id:data.id, role:data.role});

        //전송 객체 생성
        const response = NextResponse.json({ data }, { status: 200 });

        // 전송 객체에 HttpOnly 쿠키 설정 및 세팅
        // 만약, accessToken을 메모리에서 관리한다면 NextRespone 객체에 담기
        response.cookies.set("access", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 15, // 15분
            path: "/",
        });

        response.cookies.set("refresh", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7일
            path: "/",
        });

        return response;

    }catch(error) {
        console.log(error);
    }
}
