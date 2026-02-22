import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/current-workspace";

export const dynamic = "force-dynamic";

// GET: Fetch workspace/agency settings
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const workspace = user.workspace;
        return NextResponse.json({
            agency: {
                id: workspace.id,
                name: workspace.name,
                website: workspace.website,
                industry: workspace.industry,
                companySize: workspace.companySize,
                address: workspace.address,
                logoUrl: workspace.logoUrl,
                brandColorPrimary: workspace.brandColorPrimary,
                brandColorSecondary: workspace.brandColorSecondary,
            },
        });
    } catch (error) {
        console.error("GET /api/settings/agency error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

// PUT: Update agency settings
export async function PUT(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { name, website, industry, companySize, address, brandColorPrimary, brandColorSecondary } = await req.json();

        const updated = await db.workspace.update({
            where: { id: user.workspace.id },
            data: {
                name: name ?? undefined,
                website: website ?? undefined,
                industry: industry ?? undefined,
                companySize: companySize ?? undefined,
                address: address ?? undefined,
                brandColorPrimary: brandColorPrimary ?? undefined,
                brandColorSecondary: brandColorSecondary ?? undefined,
            },
        });

        return NextResponse.json({
            agency: {
                id: updated.id,
                name: updated.name,
                website: updated.website,
                industry: updated.industry,
                companySize: updated.companySize,
                address: updated.address,
                logoUrl: updated.logoUrl,
                brandColorPrimary: updated.brandColorPrimary,
                brandColorSecondary: updated.brandColorSecondary,
            },
        });
    } catch (error) {
        console.error("PUT /api/settings/agency error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
