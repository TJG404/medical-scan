import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db.js';

// mysql2는 Edge Runtime에서 안 돌아가므로 Node.js 런타임 명시
export const runtime = 'nodejs';

export async function GET() {
    try {
console.log("1------------------------------------------>> members/route.js");
        // const body = await request.json();
        // const { id } = body;
        const db = getDB();
        const [rows] = await db.execute(
            `select *  from users`,
            []
        );

        return NextResponse.json({ rows });

    }catch(error) {
        console.log(error);
    }
}

