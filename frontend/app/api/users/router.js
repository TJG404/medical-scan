// app/api/users/route.js
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = getDb();
        const [rows] = await db.query(
            'SELECT user_code, userid, email FROM users'
        );
        return NextResponse.json(rows);
    } catch (err) {
        console.error('GET /api/users error:', err);
        return NextResponse.json(
            { message: 'DB error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        // const { userid, password, email } = body;
console.log("POST body =>> ",body);
       //  const db = getDb();
       //  const [result] = await db.execute(
       //      `INSERT INTO users (id, pwd, hospital, department, name, email, phone)
       // VALUES (?, ?, ?, ?, ?, ?, ?)`,
       //      [id, pwd, hospital, department, name, email, phone]
       //  );
       //
       //  return NextResponse.json({ ok: true, result });
    } catch (err) {
        console.error('POST /api/users error:', err);
        return NextResponse.json(
            { message: 'DB error' },
            { status: 500 }
        );
    }
}
