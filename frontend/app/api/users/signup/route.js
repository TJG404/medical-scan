import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db.js';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, pwd, hospital, department, name, email, phone } = body;
        const db = getDB();
        const [result] = await db.execute(
            `insert into users(id, pwd, hospital, department, name, email, phone)
                values(?,?,?,?,?,?,?)
            `,
            [id, pwd, hospital, department, name, email, phone]
        );

        // await db.end(); //DB 연결 종료

        return NextResponse.json({ok: true});
    }catch(error) {
        console.log(error);
    }
}

