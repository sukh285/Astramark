"use client";

import { deleteBookmark, updateBookmark } from "@/app/actions/bookmarks";
import { Bookmark } from "@/app/types/db.types";
import { Copy, Info, Trash2, Check, Edit2, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);

  useEffect(() => {
    if (!isEditing) { setTitle(bookmark.title); setUrl(bookmark.url); }
  }, [bookmark, isEditing]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${bookmark.title}"?`)) await deleteBookmark(bookmark.id);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    const result = await updateBookmark(bookmark.id, formData);
    if (!result.error) setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-secondary/10 border border-primary/20 rounded-lg p-4 my-2 animate-in fade-in zoom-in-95">
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-1.5 bg-background border border-input rounded text-sm" autoFocus />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-1.5 bg-background border border-input rounded text-sm font-mono text-muted-foreground" />
          <div className="flex gap-2 justify-end pt-1">
            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold text-muted-foreground">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded">Save</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group border-b border-border hover:bg-secondary/30 transition-colors"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div onClick={() => window.open(bookmark.url, "_blank")} className="relative flex items-center justify-between py-3 px-2 cursor-pointer">
        <div className="flex-1 min-w-0 pr-4 flex items-center gap-2">
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-md">{bookmark.title}</h3>
          <ArrowUpRight size={12} className="text-muted-foreground/50 group-hover:text-primary/50" />
        </div>

        <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`} onClick={(e) => e.stopPropagation()}>
          <button onClick={handleCopy} className={`p-1.5 rounded-full border border-transparent hover:border-border transition-all ${copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"}`}><Check size={14} /></button>
          <button onClick={() => setShowInfo(!showInfo)} className={`p-1.5 rounded-full border border-transparent hover:border-border transition-all ${showInfo ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}><Info size={14} /></button>
          <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-full border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-all"><Edit2 size={14} /></button>
          <button onClick={handleDelete} className="p-1.5 rounded-full border border-transparent hover:border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 size={14} /></button>
        </div>
      </div>

      {showInfo && (
        <div className="px-2 pb-3 text-[10px] text-muted-foreground flex flex-col gap-1 animate-in slide-in-from-top-1 font-mono">
          <p className="truncate hover:text-primary select-all">{bookmark.url}</p>
          <p className="opacity-60">{new Date(bookmark.created_at).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}