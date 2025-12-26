import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db.js';
import { createAccessToken, createRefreshToken } from "@/lib/jwt.js";
// import bcrypt from "bcrypt";

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, pwd } = body;

        console.log("DB_HOST", process.env.DB_HOST);
        console.log("DB_PORT", process.env.DB_PORT);
        console.log("DB_USER", JSON.stringify(process.env.DB_USER));
        console.log("DB_NAME", process.env.DB_NAME);


        const db = getDB();
        const [rows] = await db.execute(
            ` select count(*) as count, id, role, status 
                from users 
                where id=? and pwd=? 
                group by id, role, status
            `,
            [id, pwd]
        );

        const data = rows[0] ?? { count: 1 };

        // 1) 로그인 실패
        if (data.count === 0) {
            return NextResponse.json({
                data,
                message: '아이디 또는 비밀번호가 올바르지 않습니다.',
            }, { status: 401 });
        }

        // 2) pending
        if (data.status === 'pending') {
            // console.log(data.status, "------------------------");
            return NextResponse.json({
                data: {
                    count: data.count,
                    id: data.id,
                    role: data.role,
                    status: data.status,
                },
                message: '승인 대기중입니다. 관리자 승인을 기다려 주세요.',
            }, { status: 403 });
        }

        // 3) suspended
        if (data.status === 'suspended') {
            return NextResponse.json({
                data: {
                    count: data.count,
                    id: data.id,
                    role: data.role,
                    status: data.status,
                },
                message: '정지된 계정입니다. 관리자에게 문의하세요.',
            }, { status: 403 });
        }

        // 4) active
        if (data.status === 'active') {
            const accessToken = await createAccessToken({ id: data.id, role: data.role });
            const refreshToken = await createRefreshToken({ id: data.id, role: data.role });

            const response = NextResponse.json({
                data: {
                    count: data.count,
                    id: data.id,
                    role: data.role,
                    status: data.status,
                },
                message: '로그인 성공',
            }, { status: 200 });

            response.cookies.set("access", accessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 15,
                path: "/",
            });

            response.cookies.set("refresh", refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            return response;
        }

        // 5) 예외: 정의되지 않은 status 값
        return NextResponse.json({
            data,
            message: '알 수 없는 계정 상태입니다.',
        }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: '서버 에러가 발생했습니다.',
        }, { status: 500 });
    }
}
