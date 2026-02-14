'use server';

import { BookmarkService } from "@/app/services/bookmarks.service";

// Server Action: Get bookmarks by collection
export async function getBookmarksByCollection(collectionId: string) {
  try {
    const user = await BookmarkService.getCurrentUser();
    return await BookmarkService.getByCollection({
      collectionId,
      userId: user.id,
    });
  } catch (error) {
    console.error("Action.getBookmarksByCollection Error:", error);
    return [];
  }
}

// Server Action: Create bookmark from form data
export async function createBookmark(formData: FormData) {
  try {
    const user = await BookmarkService.getCurrentUser();
    
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const collectionId = formData.get('collection_id') as string;

    if (!collectionId) {
      return { error: "Collection is required" };
    }

    const bookmark = await BookmarkService.create({
      title,
      url,
      collectionId,
      userId: user.id,
    });

    return { data: bookmark, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create bookmark";
    console.error("Action.createBookmark Error:", message);
    return { error: message };
  }
}

// Server Action: Update bookmark (title and/or url only)
export async function updateBookmark(bookmarkId: string, formData: FormData) {
  try {
    const user = await BookmarkService.getCurrentUser();
    
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    const bookmark = await BookmarkService.update({
      bookmarkId,
      userId: user.id,
      title,
      url,
    });

    return { data: bookmark, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update bookmark";
    console.error("Action.updateBookmark Error:", message);
    return { error: message };
  }
}

// Server Action: Delete bookmark
export async function deleteBookmark(bookmarkId: string) {
  try {
    const user = await BookmarkService.getCurrentUser();

    await BookmarkService.delete({
      bookmarkId,
      userId: user.id,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete bookmark";
    console.error("Action.deleteBookmark Error:", message);
    return { error: message };
  }
}