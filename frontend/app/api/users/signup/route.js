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


// /**
//  * GET /api/users
//  * 전체 사용자 목록 조회
//  */
// export async function GET() {
//     try {
//         const db = getDB();
//         const [rows] = await db.execute(
//             'SELECT id, name, email, created_at FROM users ORDER BY id DESC'
//         );
//
//         return NextResponse.json(rows, { status: 200 });
//     } catch (error) {
//         console.error('GET /api/users error:', error);
//         return NextResponse.json(
//             { message: 'Server Error', detail: error.message },
//             { status: 500 }
//         );
//     }
// }
//
// /**
//  * POST /api/users
//  * body: { name, email }
//  */
// export async function POST(request) {
//     try {
//         const body = await request.json();
//         const { id, pwd } = body;
// console.log("POST /api/users :: ",id, pwd);
//
//         // if (!id || !pwd) {
//         //     return NextResponse.json(
//         //         { message: 'name과 email은 필수입니다.' },
//         //         { status: 400 }
//         //     );
//         // }
//
//         // const db = getDB();
//         // const [result] = await db.execute(
//         //     'INSERT INTO users (name, email) VALUES (?, ?)',
//         //     [name, email]
//         // );
//         //
//         return NextResponse.json(
//             { id: result.insertId, name, email },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error('POST /api/users error:', error);
//         return NextResponse.json(
//             { message: 'Server Error', detail: error.message },
//             { status: 500 }
//         );
//     }
// }
