"use client";

import { useState, useEffect } from "react";
import {
    MessageSquare, Search, Send, Paperclip, ChevronRight,
    FolderKanban, Circle, ArrowLeft
} from "lucide-react";

type Client = { id: string; name: string; email: string };
type Conversation = { id: string; clientId: string; requestId: string | null; lastMessageAt: string; lastMessagePreview: string | null; request: { title: string } | null };
type Message = { id: string; senderId: string; senderType: string; body: string; createdAt: string };

const avatarColors = [
    "from-primary/60 to-primary/30",
    "from-emerald-500/50 to-emerald-600/20",
    "from-amber-500/50 to-amber-600/20",
    "from-rose-500/50 to-rose-600/20",
    "from-violet-500/50 to-violet-600/20",
    "from-cyan-500/50 to-cyan-600/20",
];

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.06] rounded-2xl ${className}`}>
        {children}
    </div>
);

export default function CommunicationsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        fetch("/api/communications/clients").then(r => r.json()).then(data => {
            setClients(data.clients || []);
            setConversations(data.conversations || []);
        });
    }, []);

    const activeClient = clients.find(c => c.id === selectedClient);
    const clientConversations = conversations.filter(c => c.clientId === selectedClient);
    const activeConversation = conversations.find(c => c.id === selectedConversation);

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loadMessages = async (conversationId: string) => {
        setLoadingMessages(true);
        setSelectedConversation(conversationId);
        const res = await fetch(`/api/communications/messages?conversationId=${conversationId}`);
        const data = await res.json();
        setMessages(data.messages || []);
        setLoadingMessages(false);
    };

    const sendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation) return;
        const res = await fetch("/api/communications/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId: selectedConversation, body: messageInput }),
        });
        if (res.ok) {
            const data = await res.json();
            setMessages(prev => [...prev, data.message]);
            setMessageInput("");
        }
    };

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white/90">Communications</h1>
                    <p className="text-sm text-white/50 mt-1">
                        {clients.length > 0 ? `${clients.length} clients` : "All caught up"}
                    </p>
                </div>
            </div>

            <GlassCard className="flex-1 flex overflow-hidden min-h-0">
                {/* Left: Client List */}
                <div className={`w-80 border-r border-white/[0.06] flex flex-col shrink-0 ${selectedConversation ? "hidden lg:flex" : "flex"}`}>
                    {/* Search */}
                    <div className="p-4 border-b border-white/[0.06]">
                        <div className="relative">
                            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
                            />
                        </div>
                    </div>

                    {/* Client rows */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredClients.map((client, ci) => {
                            const isSelected = selectedClient === client.id;
                            const avatar = client.name.substring(0, 2).toUpperCase();
                            const clientConvos = conversations.filter(c => c.clientId === client.id);
                            const lastConvo = clientConvos[0];

                            return (
                                <div key={client.id}>
                                    <button
                                        onClick={() => {
                                            setSelectedClient(isSelected ? null : client.id);
                                            setSelectedConversation(null);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-200 hover:bg-white/[0.04] ${isSelected ? "bg-white/[0.06]" : ""}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[ci % avatarColors.length]} flex items-center justify-center border border-white/[0.08] shrink-0`}>
                                            <span className="text-xs font-bold text-white/80">{avatar}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-white/80 truncate">{client.name}</p>
                                                {lastConvo && <span className="text-[10px] text-white/30 shrink-0 ml-2">{new Date(lastConvo.lastMessageAt).toLocaleDateString()}</span>}
                                            </div>
                                            <p className="text-xs text-white/40 truncate mt-0.5">{lastConvo?.lastMessagePreview || client.email}</p>
                                        </div>
                                    </button>

                                    {/* Project sub-list */}
                                    {isSelected && (
                                        <div className="bg-white/[0.02] border-t border-white/[0.04]">
                                            {clientConvos.length === 0 ? (
                                                <div className="pl-12 pr-4 py-2.5">
                                                    <span className="text-xs text-white/40">No conversations</span>
                                                </div>
                                            ) : clientConvos.map(convo => (
                                                <button
                                                    key={convo.id}
                                                    onClick={() => loadMessages(convo.id)}
                                                    className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 text-left transition-all duration-200 hover:bg-white/[0.04] ${selectedConversation === convo.id ? "bg-white/[0.06]" : ""}`}
                                                >
                                                    <FolderKanban className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                                                    <span className="text-xs text-white/60 truncate flex-1">{convo.request?.title || "General"}</span>
                                                    <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Chat Area */}
                <div className={`flex-1 flex flex-col min-w-0 ${!selectedConversation ? "hidden lg:flex" : "flex"}`}>
                    {selectedConversation && activeClient && activeConversation ? (
                        <>
                            {/* Chat header */}
                            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedConversation(null)}
                                    className="lg:hidden text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[clients.findIndex(c => c.id === selectedClient) % avatarColors.length]} flex items-center justify-center border border-white/[0.08] shrink-0`}>
                                    <span className="text-xs font-bold text-white/80">{activeClient.name.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white/85">{activeClient.name}</p>
                                    <div className="flex items-center gap-1.5">
                                        <FolderKanban className="w-3 h-3 text-primary/60" />
                                        <span className="text-xs text-white/40">{activeConversation.request?.title || "General"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                                    <span className="text-[10px] text-emerald-400/80">Online</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                {loadingMessages ? (
                                    <p className="text-sm text-white/40 text-center">Loading...</p>
                                ) : messages.length === 0 ? (
                                    <p className="text-sm text-white/40 text-center">No messages yet. Send the first one!</p>
                                ) : (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.senderType === "agency" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.senderType === "agency"
                                                    ? "bg-primary/20 text-white/85 rounded-br-md border border-primary/15"
                                                    : "bg-white/[0.06] text-white/75 rounded-bl-md border border-white/[0.06]"
                                                }`}>
                                                <p>{msg.body}</p>
                                                <p className={`text-[10px] mt-1.5 ${msg.senderType === "agency" ? "text-primary/50" : "text-white/25"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message input */}
                            <div className="p-4 border-t border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-all shrink-0">
                                        <Paperclip className="w-4 h-4 text-white/40" />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/[0.06] transition-all"
                                    />
                                    <button onClick={sendMessage} className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center transition-all shadow-lg shadow-primary/20 shrink-0">
                                        <Send className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty state */
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-7 h-7 text-white/20" />
                                </div>
                                <p className="text-sm font-medium text-white/50">Select a client & project</p>
                                <p className="text-xs text-white/30 mt-1">Choose a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
