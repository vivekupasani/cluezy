import { NextResponse } from "next/server";

import { put } from "@vercel/blob";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Upload file to Vercel Blob
    const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
} 