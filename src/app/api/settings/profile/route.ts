import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

// GET: Fetch current user profile
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        return NextResponse.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                jobTitle: user.jobTitle,
                location: user.location,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error("GET /api/settings/profile error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// PUT: Update user profile
export async function PUT(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { firstName, lastName, phone, jobTitle, location, bio } = await req.json();

        const updated = await db.user.update({
            where: { id: user.id },
            data: {
                firstName: firstName ?? undefined,
                lastName: lastName ?? undefined,
                phone: phone ?? undefined,
                jobTitle: jobTitle ?? undefined,
                location: location ?? undefined,
                bio: bio ?? undefined,
            },
        });

        return NextResponse.json({
            user: {
                id: updated.id,
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                phone: updated.phone,
                jobTitle: updated.jobTitle,
                location: updated.location,
                bio: updated.bio,
            },
        });
    } catch (error) {
        console.error("PUT /api/settings/profile error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
