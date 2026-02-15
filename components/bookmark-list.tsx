"use client";

import { Bookmark } from "@/app/types/db.types";
import { useState, useEffect } from "react";
import { useRealtimeBookmarks } from "@/app/hooks/use-realtime-bookmarks";
import { BookmarkItem } from "./bookmark-item";
import { createBookmark, getBookmarksByCollection } from "@/app/actions/bookmarks";
import { Plus } from "lucide-react";

interface BookmarkListProps {
  initialBookmarks: Bookmark[];
  collectionId: string;
  userId: string;
}

export function BookmarkList({
  initialBookmarks,
  collectionId,
  userId,
}: BookmarkListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Local state to hold fetched data
  const [serverData, setServerData] = useState<Bookmark[]>(initialBookmarks);
  const [loading, setLoading] = useState(initialBookmarks.length === 0);

  // FETCH EFFECT
  useEffect(() => {
    // If we have initial data (e.g. default collection on load), skip fetch
    if (initialBookmarks.length > 0) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      const data = await getBookmarksByCollection(collectionId);
      if (mounted) {
        setServerData(data);
        setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [collectionId, initialBookmarks.length]);

  // REALTIME HOOK
  const { bookmarks, setBookmarks } = useRealtimeBookmarks(serverData, collectionId, userId);

  const handleCreateBookmark = async (formData: FormData) => {
    setIsCreating(true);
    formData.append("collection_id", collectionId);
    
    // Optimistic
    const tempId = `temp-${Date.now()}`;
    const tempBookmark = {
      id: tempId,
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      collection_id: collectionId,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setBookmarks(prev => [tempBookmark, ...prev]);
    setIsAdding(false);

    const res = await createBookmark(formData);
    setIsCreating(false);
    
    if (!res.success) {
      alert(res.error);
      setBookmarks(prev => prev.filter(b => b.id !== tempId));
    } else if (res.data) {
       // Replace temp with real
       setBookmarks(prev => prev.map(b => b.id === tempId ? res.data! : b));
    }
  };

  return (
    <div className="flex-1 flex flex-col relative z-10 bg-card min-w-0 h-full">
      
      {/* HEADER */}
      <div className="p-8 pb-4 shrink-0 flex flex-col items-start gap-4">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
            isAdding 
              ? "bg-secondary text-foreground" 
              : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
          }`}
        >
          <Plus size={18} className={`transition-transform duration-200 ${isAdding ? "rotate-45" : ""}`} />
          {isAdding ? "Close" : "New Bookmark"}
        </button>

        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider pl-1">
          {loading ? "Loading..." : `${bookmarks.length} ${bookmarks.length === 1 ? 'item' : 'items'}`}
        </p>
      </div>

      {/* FORM */}
      {isAdding && (
         <div className="mx-8 mb-6 p-6 bg-secondary/10 border border-border/50 rounded-xl animate-in slide-in-from-top-2 max-w-xl">
            <form action={handleCreateBookmark} className="space-y-4">
               <div>
                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">URL</label>
                 <input name="url" type="url" placeholder="https://..." required className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" autoFocus />
               </div>
               <div>
                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Title</label>
                 <input name="title" type="text" placeholder="Title..." required className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
               </div>
               <div className="flex justify-end pt-2">
                  <button type="submit" disabled={isCreating} className="bg-foreground text-background px-6 py-2 rounded-md text-sm font-bold hover:opacity-90 transition disabled:opacity-50">
                     {isCreating ? "Saving..." : "Add to List"}
                  </button>
               </div>
            </form>
         </div>
      )}

      {/* LIST */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-8 pt-2 pb-8 relative">
        <div className="space-y-2 max-w-xl">
           {loading ? (
             <div className="space-y-3 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-14 bg-secondary/30 rounded-lg border border-border/30" />)}
             </div>
           ) : bookmarks.length === 0 && !isAdding ? (
              <div className="text-left py-10 text-muted-foreground/50 select-none">
                <p className="italic">Collection is empty.</p>
              </div>
           ) : (
              bookmarks.map(b => (
                <BookmarkItem key={b.id} bookmark={b} />
              ))
           )}
        </div>
      </div>
    </div>
  );
}