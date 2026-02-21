"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { postComment } from "@/actions/comment-actions";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

// Loose typing for convenience. In a real app we'd infer this from Prisma.
type RequestWithDetails = any;

interface Props {
    request: RequestWithDetails;
    currentUserId: string;
    trigger?: React.ReactNode;
}

export function RequestDetailsDialog({ request, currentUserId, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [text, setText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat when opened or new comment arrives
    useEffect(() => {
        if (open && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [open, request.comments]);

    async function handlePostComment(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) return;

        setIsPosting(true);
        const formData = new FormData();
        formData.append("text", text);
        formData.append("requestId", request.id);
        formData.append("workspaceId", request.workspaceId);

        const result = await postComment(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            setText("");
        }
        setIsPosting(false);
    }

    const { comments = [] } = request;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm" className="w-full justify-start text-left font-normal">
                        View Details
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 border-b shrink-0 flex flex-row items-start justify-between">
                    <div className="space-y-1 pr-6">
                        <div className="flex items-center gap-2">
                            <DialogTitle className="text-xl">{request.title}</DialogTitle>
                            <Badge variant={request.status === "Completed" ? "default" : "secondary"}>
                                {request.status}
                            </Badge>
                        </div>
                        <DialogDescription className="line-clamp-2">
                            {request.description || "No description provided."}
                        </DialogDescription>

                        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                            <div>
                                <span className="font-semibold text-foreground">Client: </span>
                                {request.client?.name}
                            </div>
                            {request.service && (
                                <div>
                                    <span className="font-semibold text-foreground">Service: </span>
                                    {request.service.name}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col bg-muted/20">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4 pb-4">
                            {comments.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground pt-10">
                                    <p>No comments yet.</p>
                                    <p className="text-sm">Start the conversation below!</p>
                                </div>
                            ) : (
                                comments.map((comment: any) => {
                                    const isMe = comment.authorId === currentUserId;
                                    const authorName = comment.author?.firstName
                                        ? `${comment.author.firstName} ${comment.author.lastName || ''}`
                                        : (comment.author?.email || 'Unknown');

                                    // Make agency replies stand out from client replies
                                    const isClient = comment.author?.role === "CLIENT";

                                    return (
                                        <div key={comment.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-xs font-semibold">
                                                    {isMe ? "You" : authorName}
                                                    {!isMe && (isClient ? " (Client)" : " (Agency)")}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <div
                                                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${isMe
                                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                        : "bg-muted rounded-tl-sm border"
                                                    }`}
                                            >
                                                {comment.text}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t bg-background shrink-0">
                        <form onSubmit={handlePostComment} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={isPosting}
                            />
                            <Button type="submit" size="icon" disabled={isPosting || !text.trim()}>
                                {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
