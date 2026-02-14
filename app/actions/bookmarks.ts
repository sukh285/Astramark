"use server";

import { revalidatePath } from "next/cache";
import { BookmarkService } from "@/app/services/bookmarks.service";

// Server Action: Fetch all bookmarks
export async function getBookmarks() {
  try {
    return await BookmarkService.getAll();
  } catch (error) {
    console.error("Action.getBookmarks Error:", error);
    return [];
  }
}

// Server Action: Create bookmark from form data
export async function createBookmark(formData: FormData) {
  try {
    // 1. Authenticate
    const user = await BookmarkService.getCurrentUser();

    // 2. Extract form data
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    // 3. Delegate to service
    const bookmark = await BookmarkService.create({
      title,
      url,
      userId: user.id,
    });

    return { data: bookmark, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create bookmark";
    console.error("Action.createBookmark Error:", message);
    return { error: message };
  }
}

// Server Action: Delete bookmark
export async function deleteBookmark(bookmarkId: string) {
  try {
    // 1. Authenticate
    const user = await BookmarkService.getCurrentUser();

    // 2. Delegate to service
    await BookmarkService.delete({
      bookmarkId,
      userId: user.id,
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete bookmark";
    console.error("Action.deleteBookmark Error:", message);
    return { error: message };
  }
}

// Server Action: Update bookmark
export async function updateBookmark(bookmarkId: string, formData: FormData) {
  try {
    // 1. Authenticate
    const user = await BookmarkService.getCurrentUser();

    // 2. Extract data
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    // 3. Delegate to service
    const bookmark = await BookmarkService.update({
      bookmarkId,
      userId: user.id,
      title,
      url,
    });

    // 4. Revalidate
    revalidatePath("/"); 

    return { data: bookmark, success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update bookmark";
    console.error("Action.updateBookmark Error:", message);
    return { error: message };
  }
}
