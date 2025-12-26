import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { dir, index, newName } = await req.json();
        const baseDir = "C:/dev/medical-scan/frontend/public/dicom-thumb";

// dir이 "/201608/..." 또는 "201608/..." 둘 다 안전 처리
        const safeDir = String(dir || "").replace(/^\/+/, "").replace(/\\/g, "/");

        const folder = path.join(baseDir, safeDir);
        const pngFiles = fs.readdirSync(folder)
            .filter(f => f.toLowerCase().endsWith(".png"))
            .sort(); // 정렬 중요

        const oldName = pngFiles[index];
        const oldPath = path.join(folder, oldName);
        const newPath = path.join(folder, newName);

        fs.renameSync(oldPath, newPath);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Rename failed" },
            { status: 500 }
        );
    }
}
