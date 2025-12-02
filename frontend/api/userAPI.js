import {getDb} from "@/api/db.js";
import {NextResponse} from "next/server";

/**
 * axiosPost 함수를 이용하여 백엔드 연동 처리
 */
export const axiosPost = async (url, data) => {
    // try{
        console.log("POST body =>> ",url, data);
        // const reqUrl = `http://localhost:9000${url}`;
        // const response = await api.post( reqUrl, data,
        //     { headers: { "Content-Type": "application/json"} });
        // return response.data;

        try {
            // const body = await request.json();
            // const { userid, password, email } = body;
            // console.log("POST body =>> ",body);
             const db = getDb();
             const [result] = await db.execute(
                 `INSERT INTO users (id, pwd, hospital, department, name, email, phone)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                 [id, pwd, hospital, department, name, email, phone]
             );
            //
             return NextResponse.json({ ok: true, result });
        } catch (err) {
            console.error('POST /api/users error:', err);
            return NextResponse.json(
                { message: 'DB error' },
                { status: 500 }
            );
        }


    // }catch(error) {
    //     console.log("🎯 에러발생, 페이지 이동합니다!!", error);
    // }
}