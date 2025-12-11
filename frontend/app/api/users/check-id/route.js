// app/api/users/route.js
import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db.js';

// mysql2는 Edge Runtime에서 안 돌아가므로 Node.js 런타임 명시
export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;
        const db = getDB();
        const [rows] = await db.execute(
            `select count(*) as count from users where id = ?`,
            [id]
        );
        // await db.end();  //DB pool 연결 종료 - 회원가입 중 아이디체크하고 DB 연결이 종료됨!
        const count = rows[0].count;
        const result = count > 0;

        return NextResponse.json({ result });

    }catch(error) {
        console.log(error);
    }
}

