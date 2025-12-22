import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db.js';

// mysql2는 Edge Runtime에서 안 돌아가므로 Node.js 런타임 명시
export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const body = await request.json();
        const pid = body;
        const db = getDB();
        const [rows] = await db.execute(
            `
                SELECT *
                FROM radiologist_reports
                WHERE patient_id = ?
                order by patient_id desc limit 1
            `,
            [pid]
        );

        const result = rows[0];
        return NextResponse.json({ result });

    }catch(error) {
        console.log(error);
    }
}

