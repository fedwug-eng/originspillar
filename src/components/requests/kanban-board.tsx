"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateRequestStatus } from "@/app/actions/requests";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestDetailsDialog } from "@/components/requests/request-details-dialog";

// --- Sortable Item Component ---
function SortableRequestCard({ request, currentUserId }: { request: any, currentUserId: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: request.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-zinc-900 border border-white/5 p-4 rounded-xl shadow-lg group cursor-grab active:cursor-grabbing hover:border-violet-500/50 hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)] transition-all z-10 ${isDragging ? "ring-2 ring-violet-500 shadow-2xl scale-105" : ""}`}
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {request.id.slice(-6)}
                </span>
                <RequestDetailsDialog
                    request={request}
                    currentUserId={currentUserId}
                    trigger={
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white hover:bg-white/10"
                        >
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                    }
                />
            </div>
            <h4 className="font-semibold text-sm text-zinc-100 mb-3">{request.title}</h4>
            <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                {request.client && (
                    <span className="text-[11px] font-medium text-zinc-300 truncate max-w-[120px] flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                        {request.client.name}
                    </span>
                )}
                <div className="flex gap-2 text-zinc-500 items-center">
                    {request.tag && (
                        <span className="text-[10px] border border-white/10 bg-white/5 px-1.5 py-0.5 rounded-md text-zinc-400">
                            {request.tag}
                        </span>
                    )}
                    {request.comments?.length > 0 && (
                        <div className="flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-md">
                            <MessageSquare className="h-3 w-3" />
                            {request.comments.length}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

// --- Main Kanban Board Component ---
export function KanbanBoard({ initialRequests, currentUserId }: { initialRequests: any[], currentUserId: string }) {
    const COLUMNS = ["Backlog", "In Progress", "In Review", "Completed"];

    // Initialize state with the fetched requests
    const [requests, setRequests] = useState(initialRequests);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeIndex = requests.findIndex((r) => r.id === activeId);
        if (activeIndex === -1) return;

        let newStatus = "";

        // If dropped over a column header (the droppable ID is the column name)
        if (COLUMNS.includes(overId as string)) {
            newStatus = overId as string;
        } else {
            // If dropped over another item, inherit its status
            const overIndex = requests.findIndex((r) => r.id === overId);
            if (overIndex !== -1) {
                newStatus = requests[overIndex].status;
            }
        }

        if (!newStatus) return;

        // Optimistically update UI
        const originalRequests = [...requests];
        const updatedRequests = [...requests];

        // Set the new status
        updatedRequests[activeIndex] = {
            ...updatedRequests[activeIndex],
            status: newStatus,
        };

        setRequests(updatedRequests);

        // Persist to database
        try {
            await updateRequestStatus(activeId as string, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure
            setRequests(originalRequests);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 overflow-auto pb-4">
                {COLUMNS.map((colName) => {
                    const columnTasks = requests.filter((r) => r.status === colName);

                    // Map column names to subtle glowing border colors for aesthetics
                    const getColTheme = (name: string) => {
                        switch (name) {
                            case "Completed": return "border-emerald-500/20 bg-emerald-950/10";
                            case "In Progress": return "border-blue-500/20 bg-blue-950/10";
                            case "In Review": return "border-amber-500/20 bg-amber-950/10";
                            default: return "border-white/5 bg-zinc-950/50";
                        }
                    }

                    return (
                        <div
                            key={colName}
                            className={`flex flex-col rounded-2xl p-4 min-h-[500px] border border-dashed backdrop-blur-sm ${getColTheme(colName)}`}
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <h3 className="font-semibold text-sm flex items-center gap-2 text-zinc-200 uppercase tracking-wider">
                                    {colName}
                                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-zinc-400 font-medium">
                                        {columnTasks.length}
                                    </span>
                                </h3>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <SortableContext
                                id={colName}
                                items={columnTasks.map((t) => t.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4 flex-1 pb-4">
                                    {columnTasks.map((task) => (
                                        <SortableRequestCard key={task.id} request={task} currentUserId={currentUserId} />
                                    ))}
                                    {/* Empty drop zone so columns can accept items even when empty */}
                                    {columnTasks.length === 0 && (
                                        <div className="h-full min-h-[100px] border-2 border-transparent" />
                                    )}
                                </div>
                            </SortableContext>
                        </div>
                    );
                })}
            </div>

            <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeId ? (
                    <SortableRequestCard
                        request={requests.find((r) => r.id === activeId)}
                        currentUserId={currentUserId}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
