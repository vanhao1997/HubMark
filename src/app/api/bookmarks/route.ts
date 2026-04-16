import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { fetchAndSummarize } from "@/lib/gemini";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { url, groupId } = await req.json();
        if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

        const { title, summary } = await fetchAndSummarize(url);

        const bookmark = await db.bookmark.create({
            data: {
                url,
                title,
                contentSummary: summary,
                userId: session.user.id,
                groupId: groupId || null,
            },
        });

        return NextResponse.json(bookmark, { status: 201 });
    } catch (error) {
        console.error("Error generating bookmark:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const bookmarks = await db.bookmark.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: { group: true }
        });
        return NextResponse.json(bookmarks);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
