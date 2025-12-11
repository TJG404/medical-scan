import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db.js';
import { verifyAccessToken } from '@/lib/jwt.js';

// mysql2는 Edge Runtime에서 안 돌아가므로 Node.js 런타임 명시
export const runtime = 'nodejs';

/**
 * 회원정보 조회
 */
export async function POST(request) {
    try {
        const accessToken = request.cookies.get('access')?.value;
        if (!accessToken) {
            return NextResponse.json({
                message: 'access 토큰이 없습니다.',
            }, { status: 401 });
        }

        let payload;
        try {
            payload = verifyAccessToken(accessToken, process.env.JWT_ACCESS_SECRET);
        } catch (err) {
            console.error('access verify error:', err);
            // 만료 / 위조 → 일단 401 반환 (프론트에서 refresh 진행)
            return NextResponse.json({
                message: '유효하지 않은 access 토큰입니다.',
            }, { status: 401 });
        }
        console.log(payload, "-----------------------> payload");

        const db = getDB();
        const [rows] = await db.execute(
            `select *  from users where role != ?`,
            ['admin']
        );

        return NextResponse.json({ rows });

    }catch(error) {
        console.log(error);
    }
}


/**
 * 회원정보 수정
 */
export async function PUT(request) {
    try {
        const accessToken = request.cookies.get('access')?.value;
        if (!accessToken) {
            return NextResponse.json({
                message: 'access 토큰이 없습니다.',
            }, { status: 401 });
        }

        let payload;
        try {
            payload = verifyAccessToken(accessToken, process.env.JWT_ACCESS_SECRET);
        } catch (err) {
            console.error('access verify error:', err);
            // 만료 / 위조 → 일단 401 반환 (프론트에서 refresh 진행)
            return NextResponse.json({
                message: '유효하지 않은 access 토큰입니다.',
            }, { status: 401 });
        }
        let body;

        if (!body) {
            body = await request.json();
        }

console.log(body, "-------------------> body");
        const db = getDB();
        const [rows] = await db.execute(
            `update users set email = ?, status = ?, role = ? where id = ?`,
            [body.email, body.status, body.role, body.id]
        );
        const result = rows.affectedRows;
        console.log(result);

        return NextResponse.json({ result });

    }catch(error) {
        console.log(error);
    }
}