"use client";

import { deleteBookmark, updateBookmark } from "@/app/actions/bookmarks";
import { Bookmark } from "@/app/types/db.types";
import { 
  Copy, 
  Info, 
  Trash2, 
  Check, 
  Edit2, 
  ArrowUpRight,
  X,
  Save,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);

  // Sync state
  useEffect(() => {
    if (!isEditing) {
      setTitle(bookmark.title);
      setUrl(bookmark.url);
    }
  }, [bookmark, isEditing]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this bookmark?")) {
      await deleteBookmark(bookmark.id);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) return;
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    
    const result = await updateBookmark(bookmark.id, formData);
    setIsSaving(false);
    
    if (!result.error) setIsEditing(false);
    else alert(result.error);
  };

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <div className="bg-secondary/20 border border-primary/10 rounded-lg p-2 my-2 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-2">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-full px-2 py-1.5 bg-background border-none rounded text-sm font-semibold focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50"
            placeholder="Title"
            autoFocus 
            disabled={isSaving}
          />
          <input 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            className="w-full px-2 py-1.5 bg-background border-none rounded text-xs font-mono text-muted-foreground focus:ring-1 focus:ring-primary/20"
            placeholder="URL"
            disabled={isSaving}
          />
          <div className="flex gap-2 justify-end pt-1 pr-1">
            <button 
              onClick={() => setIsEditing(false)} 
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              CANCEL
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
              SAVE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW MODE ---
  return (
    <div
      className="group relative border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors rounded-lg -mx-2 px-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => window.open(bookmark.url, "_blank")}
        className="flex items-center gap-4 py-3 cursor-pointer select-none"
      >
        {/* Left Content (Text) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
              {bookmark.title}
            </h3>
            <ArrowUpRight size={10} className="text-muted-foreground/40 group-hover:text-primary/50 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <div className="text-[11px] text-muted-foreground/60 font-mono truncate">
             {new URL(bookmark.url).hostname.replace('www.', '')}
          </div>
        </div>

        {/* Right Actions (Only visible on hover, fixed width container) */}
        <div
          className={`flex items-center gap-1 shrink-0 transition-all duration-200 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ActionButton onClick={handleCopy} icon={copied ? Check : Copy} active={copied} label="Copy" />
          <ActionButton onClick={() => setShowInfo(!showInfo)} icon={Info} active={showInfo} label="Info" />
          <ActionButton onClick={() => setIsEditing(true)} icon={Edit2} label="Edit" />
          <ActionButton onClick={handleDelete} icon={Trash2} variant="danger" label="Delete" />
        </div>
      </div>

      {/* Info Dropdown */}
      {showInfo && (
        <div className="px-3 pb-3 pt-1 text-[10px] text-muted-foreground flex flex-col gap-1.5 animate-in slide-in-from-top-1 font-mono">
          <div className="h-[1px] bg-border/40 w-full mb-1" />
          <div className="flex gap-2 items-baseline">
             <span className="font-bold shrink-0 text-primary/70">URL</span>
             <p className="truncate hover:text-primary select-all cursor-text">{bookmark.url}</p>
          </div>
          <div className="flex gap-2 items-baseline">
             <span className="font-bold shrink-0 text-primary/70">DATE</span>
             <p>{new Date(bookmark.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, active, variant, label }: any) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-md transition-all ${
        active 
          ? "text-primary bg-primary/10 ring-1 ring-primary/20" 
          : "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm"
      } ${
        variant === "danger" 
          ? "hover:text-destructive hover:bg-destructive/10" 
          : ""
      }`}
    >
      <Icon size={14} strokeWidth={2} />
    </button>
  );
}