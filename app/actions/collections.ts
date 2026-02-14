'use server';

import { CollectionsService } from "@/app/services/collections.service";

// Server Action: Fetch all collections 
export async function getCollections() {
  try {
    return await CollectionsService.getAll();
  } catch (error) {
    console.error("Action.getCollections Error:", error);
    return [];
  }
}

// Server Action: Get default collection
export async function getDefaultCollection() {
  try {
    return await CollectionsService.getDefault();
  } catch (error) {
    console.error("Action.getDefaultCollection Error:", error);
    return null;
  }
}

// Server Action: Create collection from form data
export async function createCollection(formData: FormData) {
  try {
    const user = await CollectionsService.getCurrentUser();
    const title = formData.get('title') as string;

    const collection = await CollectionsService.create({
      title,
      userId: user.id,
    });

    return { data: collection, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create collection";
    console.error("Action.createCollection Error:", message);
    return { error: message };
  }
}

// Server Action: Update collection
export async function updateCollection(collectionId: string, formData: FormData) {
  try {
    const user = await CollectionsService.getCurrentUser();
    const title = formData.get('title') as string;

    const collection = await CollectionsService.update({
      collectionId,
      title,
      userId: user.id,
    });

    return { data: collection, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update collection";
    console.error("Action.updateCollection Error:", message);
    return { error: message };
  }
}

// Server Action: Delete collection
export async function deleteCollection(collectionId: string) {
  try {
    const user = await CollectionsService.getCurrentUser();

    await CollectionsService.delete({
      collectionId,
      userId: user.id,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete collection";
    console.error("Action.deleteCollection Error:", message);
    return { error: message };
  }
}