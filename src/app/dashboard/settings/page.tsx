import { currentUser } from "@/lib/current-workspace";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";
import { Settings as SettingsIcon, User, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and workspace settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Card */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-violet-500" />
                            <CardTitle className="text-gray-900">Profile</CardTitle>
                        </div>
                        <CardDescription>Your account information managed by Clerk.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "h-16 w-16" } }} />
                            <div>
                                <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 mt-1">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Workspace Card */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-500" />
                            <CardTitle className="text-gray-900">Workspace</CardTitle>
                        </div>
                        <CardDescription>Your agency workspace details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Name</label>
                            <p className="text-gray-900 font-medium">{user.workspace.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Slug</label>
                            <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">{user.workspace.slug}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Created</label>
                            <p className="text-gray-900">{new Date(user.workspace.createdAt).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
