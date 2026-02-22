import Link from "next/link";
import { ArrowLeft, Mail, Bell as BellIcon, MessageSquare, CreditCard, FolderKanban, Users } from "lucide-react";

export const dynamic = "force-dynamic";

const notificationGroups = [
    {
        title: "Messages",
        icon: MessageSquare,
        items: [
            { label: "New client message", email: true, inapp: true },
            { label: "Message reply", email: false, inapp: true },
        ]
    },
    {
        title: "Projects",
        icon: FolderKanban,
        items: [
            { label: "New request submitted", email: true, inapp: true },
            { label: "Project status changed", email: true, inapp: true },
            { label: "Task completed", email: false, inapp: true },
        ]
    },
    {
        title: "Billing",
        icon: CreditCard,
        items: [
            { label: "Invoice paid", email: true, inapp: true },
            { label: "Payment overdue", email: true, inapp: true },
        ]
    },
    {
        title: "Clients",
        icon: Users,
        items: [
            { label: "New client onboarded", email: true, inapp: true },
        ]
    },
];

export default function NotificationsSettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <Link href="/dashboard/settings" className="text-xs text-dash-muted hover:text-primary transition-colors flex items-center gap-1 mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back to Settings
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Notifications</h2>
                <p className="text-dash-muted mt-1">Choose how you want to be notified.</p>
            </div>

            {notificationGroups.map((group) => (
                <div key={group.title} className="bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <group.icon className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold text-dash-text">{group.title}</h3>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-end gap-8 mb-3 pr-1">
                        <div className="flex items-center gap-1 text-[10px] text-dash-muted uppercase tracking-wider font-semibold">
                            <Mail className="w-3 h-3" /> Email
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-dash-muted uppercase tracking-wider font-semibold">
                            <BellIcon className="w-3 h-3" /> In-App
                        </div>
                    </div>

                    <div className="space-y-3">
                        {group.items.map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-2">
                                <span className="text-sm text-dash-text">{item.label}</span>
                                <div className="flex items-center gap-8">
                                    <ToggleSwitch defaultChecked={item.email} />
                                    <ToggleSwitch defaultChecked={item.inapp} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ToggleSwitch({ defaultChecked }: { defaultChecked: boolean }) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
            <div className="w-9 h-5 bg-white/[0.06] rounded-full peer peer-checked:bg-primary/60 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dash-muted after:peer-checked:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
        </label>
    );
}
