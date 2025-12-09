import mysql from 'mysql2/promise';

let pool;

/**
 * MySQL 커넥션 풀 반환
 * - 개발 모드에서 HMR 때문에 여러 번 생성되는 것을 방지하기 위해
 *   globalThis에 저장하는 패턴을 써도 됨
 */
export function getDB() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }
    return pool;
}
