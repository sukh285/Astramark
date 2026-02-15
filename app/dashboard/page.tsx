import { createClient } from "@/lib/supabase/server";
import { getBookmarks } from "@/app/actions/bookmarks";
import { BookmarkList } from "@/components/bookmark-list";
import { BookmarkForm } from "@/components/bookmark-form";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get user (layout already checked auth, but we need userId for bookmarks)
  const { data: { user } } = await supabase.auth.getUser();
  
  // This should never happen since layout redirects, but TypeScript safety
  if (!user) return null;

  // Fetch bookmarks with userId
  const initialBookmarks = await getBookmarks(user.id);

  return (
    <>
      {/* A. LEFT COLUMN: Content (Scrollable) */}
      <div className="flex-1 flex flex-col border-r border-border/50 relative z-10 bg-card min-w-0">
        
        {/* Header Area */}
        <div className="p-8 pb-6 border-b border-border/40 shrink-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Collection</h1>
            <p className="text-sm text-muted-foreground">
               Manage your saved links and resources.
            </p>
          </div>
          
          {/* Add Form injected here */}
          <BookmarkForm />
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide relative">
           {/* Top Blur */}
           <div className="sticky top-0 h-4 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
           
           <div className="px-8 pb-10">
              <BookmarkList initialBookmarks={initialBookmarks} userId={user.id} />
           </div>

           {/* Bottom Blur */}
           <div className="sticky bottom-0 h-12 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* B. RIGHT COLUMN: Visual Identity */}
      <div className="w-20 md:w-32 lg:w-40 relative overflow-hidden hidden sm:flex items-center justify-center bg-card select-none shrink-0">
         <div 
           className="text-[60px] md:text-[80px] lg:text-[100px] font-black tracking-tighter opacity-[0.04] text-foreground pointer-events-none uppercase leading-[0.8]"
           style={{ 
             writingMode: 'vertical-rl', 
             textOrientation: 'mixed',
             transform: 'rotate(180deg)',
             maxHeight: '100%',
             textAlign: 'right'
           }}
         >
            BOOKMARKS
         </div>
      </div>
    </>
  );
}