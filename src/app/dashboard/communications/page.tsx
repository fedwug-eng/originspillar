"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Send, Paperclip, ChevronRight, ChevronLeft, Folder } from "lucide-react";

interface Client {
    id: string;
    name: string;
    email: string;
}

interface Conversation {
    id: string;
    clientId: string;
    requestId: string | null;
    lastMessageAt: string;
    lastMessagePreview: string | null;
    request: { title: string } | null;
}

interface Message {
    id: string;
    body: string;
    senderType: string;
    createdAt: string;
}

export default function CommunicationsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedClient, setExpandedClient] = useState<string | null>(null);
    const [mobileView, setMobileView] = useState<"list" | "chat">("list");

    // Fetch clients and conversations
    useEffect(() => {
        fetch("/api/communications/clients")
            .then(r => r.ok ? r.json() : { clients: [], conversations: [] })
            .then(data => {
                setClients(data.clients || []);
                setConversations(data.conversations || []);
            })
            .catch(() => { });
    }, []);

    // Fetch messages when conversation selected
    useEffect(() => {
        if (!selectedConversation) return;
        fetch(`/api/communications/messages?conversationId=${selectedConversation}`)
            .then(r => r.ok ? r.json() : { messages: [] })
            .then(data => setMessages(data.messages || []))
            .catch(() => { });
    }, [selectedConversation]);

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clientConversations = (clientId: string) =>
        conversations.filter(c => c.clientId === clientId);

    const selectedClientData = clients.find(c => c.id === selectedClient);
    const selectedConvData = conversations.find(c => c.id === selectedConversation);

    const handleSend = async () => {
        if (!messageInput.trim() || !selectedConversation) return;
        try {
            const res = await fetch("/api/communications/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId: selectedConversation, body: messageInput }),
            });
            if (res.ok) {
                const msg = await res.json();
                setMessages(prev => [...prev, msg.message]);
                setMessageInput("");
            }
        } catch { }
    };

    const avatarGradients = [
        "from-violet-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-amber-500 to-orange-600",
        "from-rose-500 to-pink-600",
        "from-blue-500 to-cyan-600",
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-dash-text">Communications</h2>
                <p className="text-dash-muted mt-1">Client conversations organized by project.</p>
            </div>

            <div className="flex-1 min-h-0 flex gap-4 rounded-2xl overflow-hidden">
                {/* Left Panel — Client List */}
                <div className={`${mobileView === "list" ? "flex" : "hidden"} lg:flex w-full lg:w-80 flex-col bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl overflow-hidden shrink-0`}>
                    {/* Search */}
                    <div className="p-3 border-b border-white/[0.06]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dash-muted" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] pl-9 pr-3 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none focus:border-primary/40 transition-all"
                            />
                        </div>
                    </div>

                    {/* Client List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredClients.length === 0 ? (
                            <div className="text-center py-12 text-dash-muted text-sm">
                                {clients.length === 0 ? "No clients yet" : "No matches"}
                            </div>
                        ) : (
                            filteredClients.map((client, idx) => {
                                const gradient = avatarGradients[idx % avatarGradients.length];
                                const convs = clientConversations(client.id);
                                const isExpanded = expandedClient === client.id;
                                const lastConv = convs[0];

                                return (
                                    <div key={client.id}>
                                        <button
                                            onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                                            className={`w-full flex items-center gap-3 p-3 hover:bg-white/[0.04] transition-all text-left ${isExpanded ? "bg-white/[0.04]" : ""}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-dash-text truncate">{client.name}</p>
                                                <p className="text-xs text-dash-muted truncate">{lastConv?.lastMessagePreview || "No messages yet"}</p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 text-dash-muted/40 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                                        </button>

                                        {/* Expanded projects */}
                                        {isExpanded && (
                                            <div className="bg-white/[0.02] border-t border-white/[0.04]">
                                                {convs.length === 0 ? (
                                                    <p className="text-xs text-dash-muted p-3 pl-16">No conversations</p>
                                                ) : (
                                                    convs.map(conv => (
                                                        <button
                                                            key={conv.id}
                                                            onClick={() => {
                                                                setSelectedClient(client.id);
                                                                setSelectedConversation(conv.id);
                                                                setMobileView("chat");
                                                            }}
                                                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 pl-16 text-left hover:bg-white/[0.04] transition-all ${selectedConversation === conv.id ? "bg-primary/10 text-primary" : ""}`}
                                                        >
                                                            <Folder className="w-3.5 h-3.5 text-dash-muted shrink-0" />
                                                            <span className="text-xs font-medium truncate">{conv.request?.title || "General"}</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel — Chat */}
                <div className={`${mobileView === "chat" ? "flex" : "hidden"} lg:flex flex-1 flex-col bg-dash-card backdrop-blur-md border border-dash-border rounded-2xl overflow-hidden`}>
                    {!selectedConversation ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                                <MessageSquare className="w-9 h-9 text-dash-muted/40" />
                            </div>
                            <p className="text-base font-semibold text-dash-muted">Select a client & project</p>
                            <p className="text-sm text-dash-muted/60 mt-1">Choose a conversation from the left to start messaging.</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 border-b border-white/[0.06] flex items-center gap-3 px-5 shrink-0">
                                <button onClick={() => setMobileView("list")} className="lg:hidden text-dash-muted hover:text-white p-1">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                    {selectedClientData?.name.substring(0, 2).toUpperCase() || "??"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-dash-text">{selectedClientData?.name || "Client"}</p>
                                    <div className="flex items-center gap-1.5 text-xs text-dash-muted">
                                        <Folder className="w-3 h-3" />
                                        <span className="truncate">{selectedConvData?.request?.title || "General"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span className="text-xs text-emerald-400">Online</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-3">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12 text-dash-muted text-sm">
                                        No messages yet. Start the conversation!
                                    </div>
                                ) : (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.senderType === "agency" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.senderType === "agency"
                                                    ? "bg-primary/20 text-dash-text rounded-br-md"
                                                    : "bg-white/[0.06] text-dash-text rounded-bl-md"
                                                }`}>
                                                <p className="text-sm leading-relaxed">{msg.body}</p>
                                                <p className="text-[10px] text-dash-muted/60 mt-1">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Input Bar */}
                            <div className="border-t border-white/[0.06] p-4 flex items-center gap-3">
                                <button className="text-dash-muted hover:text-white transition-colors p-2">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    className="flex-1 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 text-sm text-dash-text placeholder:text-dash-muted focus:outline-none focus:border-primary/40 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!messageInput.trim()}
                                    className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/80 flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
