import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { KeysClient } from "./KeysClient";

export default async function GatewayKeysPage() {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const keys = await db.gatewayKey.findMany({
        where: { workspaceId: user.workspace.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <KeysClient initialKeys={keys} />
    );
}
