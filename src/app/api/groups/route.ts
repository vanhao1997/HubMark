import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, description } = await req.json();
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const group = await db.group.create({
            data: {
                name,
                description,
                userId: session.user.id,
            },
        });

        return NextResponse.json(group, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const groups = await db.group.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(groups);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
