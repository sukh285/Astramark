"use client";

import { createCollection, deleteCollection } from "@/app/actions/collections";
import { Collection } from "@/app/types/db.types";
import { SidebarClose, SidebarOpen, LogOut, Folder, Plus, Trash2, Bookmark } from "lucide-react";
import { useState, useRef } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  collections: Collection[];
  activeCollectionId: string;
  onSelectCollection: (id: string) => void;
  userEmail: string;
}

export function Sidebar({ 
  collections, 
  activeCollectionId, 
  onSelectCollection,
  userEmail 
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleCreate(formData: FormData) {
    const res = await createCollection(formData);
    if (res.success) {
      setIsCreating(false);
      formRef.current?.reset();
      if (res.data) onSelectCollection(res.data.id);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Delete this collection? All bookmarks inside it will be lost.")) return;

    if (id === activeCollectionId) {
      const defaultCol = collections.find(c => c.is_default);
      if (defaultCol) onSelectCollection(defaultCol.id);
    }
    await deleteCollection(id);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const defaultCollection = collections.find(c => c.is_default);
  const userCollections = collections.filter(c => !c.is_default);

  return (
    <aside className={`h-screen sticky top-0 z-40 flex flex-col border-r bg-card transition-all duration-300 ease-in-out flex-shrink-0 ${isOpen ? "w-64" : "w-20 items-center"}`}>
      {/* HEADER */}
      <div className="flex flex-col w-full">
        <div className={`h-16 flex items-center shrink-0 ${isOpen ? "px-6 gap-3" : "justify-center"}`}>
           <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold text-primary-foreground">A</div>
           {isOpen && <span className="font-bold tracking-tight text-lg whitespace-nowrap overflow-hidden">Astra<span className="text-primary">mark</span></span>}
        </div>

        {isOpen ? (
          <div className="px-6 pb-2 pt-4 flex items-center justify-between">
             <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Collections</h2>
             <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><SidebarClose size={16} /></button>
          </div>
        ) : (
           <button onClick={() => setIsOpen(true)} className="h-10 w-full flex items-center justify-center text-muted-foreground hover:text-primary mb-4"><SidebarOpen size={20} /></button>
        )}
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-2 px-3 space-y-1">
        {/* DEFAULT */}
        {defaultCollection && (
          <button 
            onClick={() => onSelectCollection(defaultCollection.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
              activeCollectionId === defaultCollection.id
                ? "bg-primary text-primary-foreground font-bold shadow-sm" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Bookmark size={20} className="shrink-0" />
            {isOpen && <span className="whitespace-nowrap overflow-hidden">Your Bookmarks</span>}
          </button>
        )}

        {isOpen && (
          <button onClick={() => setIsCreating(true)} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary pl-10">
             <Plus size={14} /> <span>Create Collection</span>
          </button>
        )}

        {isOpen && <div className="my-3 mx-3 h-[1px] bg-primary/20" />}

        {isOpen && isCreating && (
          <form ref={formRef} action={handleCreate} className="px-2 mb-2 animate-in slide-in-from-left-2 fade-in">
            <input name="title" autoFocus placeholder="Name..." maxLength={20} className="w-full text-sm bg-secondary/50 border border-input rounded px-3 py-2" />
            <div className="flex gap-2 mt-2 justify-end">
              <button type="button" onClick={() => setIsCreating(false)} className="text-[10px] font-bold text-muted-foreground">Cancel</button>
              <button type="submit" className="text-[10px] font-bold text-primary">Save</button>
            </div>
          </form>
        )}

        {isOpen && userCollections.map(collection => (
          <div key={collection.id} onClick={() => onSelectCollection(collection.id)} className={`group relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${activeCollectionId === collection.id ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}>
            <Folder size={18} className={`shrink-0 ${activeCollectionId === collection.id ? "text-primary" : ""}`} />
            <span className="truncate flex-1 text-left">{collection.title}</span>
            <button onClick={(e) => handleDelete(e, collection.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-border/50 bg-card mt-auto shrink-0">
        <div className={`flex items-center gap-3 ${!isOpen ? "flex-col" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border"><div className="text-xs font-bold text-primary">{userEmail[0].toUpperCase()}</div></div>
          {isOpen && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate text-foreground">{userEmail.split('@')[0]}</p>
              <button onClick={handleSignOut} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-destructive mt-0.5"><LogOut size={12} /> Sign out</button>
            </div>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </aside>
  );
}