import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { getGatewayUsageData } from "./actions";
import { UsageClient } from "./UsageClient";

export default async function GatewayUsagePage() {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const initialData = await getGatewayUsageData(1);

    return (
        <UsageClient initialData={initialData} />
    );
}
