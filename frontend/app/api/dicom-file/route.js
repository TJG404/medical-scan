import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const rel = searchParams.get("p");
    if (!rel) return new Response("Missing p", { status: 400 });

    // ⚠️ 실제 서비스에서는 반드시 화이트리스트/검증 필요
    const baseDir = "C:\\dev"; //dicom file
    const filePath = path.join(baseDir, rel);

    if (!fs.existsSync(filePath)) return new Response("Not found", { status: 404 });

    const data = fs.readFileSync(filePath);
    return new Response(data, {
        headers: {
            "Content-Type": "application/dicom",
            "Cache-Control": "no-store",
        },
    });
}
