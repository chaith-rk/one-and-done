'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createListSchema, updateListSchema } from '@/lib/validations';
import type { List, CreateListInput, UpdateListInput } from '@/types/database.types';

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all lists for the current user
 * Auto-sorted by creation date (newest first)
 */
export async function getLists(): Promise<ActionResult<List[]>> {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Fetch lists
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }); // Creation order as per PRD

  if (error) {
    return {
      success: false,
      error: 'Failed to fetch lists',
    };
  }

  return {
    success: true,
    data: data as List[],
  };
}

/**
 * Get a single list by ID
 */
export async function getListById(listId: string): Promise<ActionResult<List>> {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Fetch list
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('id', listId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return {
      success: false,
      error: 'List not found',
    };
  }

  return {
    success: true,
    data: data as List,
  };
}

/**
 * Create a new list
 */
export async function createList(input: CreateListInput): Promise<ActionResult<List>> {
  // Validate input
  const validation = createListSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Create list
  const { data, error } = await supabase
    .from('lists')
    .insert({
      user_id: user.id,
      name: validation.data.name,
      is_inbox: validation.data.is_inbox || false,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to create list',
    };
  }

  revalidatePath('/');

  return {
    success: true,
    data: data as List,
  };
}

/**
 * Update an existing list
 * Note: Inbox list name cannot be changed
 */
export async function updateList(
  listId: string,
  input: UpdateListInput
): Promise<ActionResult<List>> {
  // Validate input
  const validation = updateListSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Check if list is Inbox (protected)
  const { data: existingList, error: fetchError } = await supabase
    .from('lists')
    .select('is_inbox')
    .eq('id', listId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    return {
      success: false,
      error: 'List not found',
    };
  }

  if (existingList.is_inbox) {
    return {
      success: false,
      error: 'Cannot rename the Inbox list',
    };
  }

  // Update list
  const { data, error } = await supabase
    .from('lists')
    .update({
      name: validation.data.name,
    })
    .eq('id', listId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to update list',
    };
  }

  revalidatePath('/');

  return {
    success: true,
    data: data as List,
  };
}

/**
 * Delete a list
 * Note: Inbox list cannot be deleted
 * All tasks in the list will be cascade deleted
 */
export async function deleteList(listId: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Check if list is Inbox (protected)
  const { data: existingList, error: fetchError } = await supabase
    .from('lists')
    .select('is_inbox')
    .eq('id', listId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    return {
      success: false,
      error: 'List not found',
    };
  }

  if (existingList.is_inbox) {
    return {
      success: false,
      error: 'Cannot delete the Inbox list',
    };
  }

  // Delete list (tasks will cascade delete via ON DELETE CASCADE)
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId)
    .eq('user_id', user.id);

  if (error) {
    return {
      success: false,
      error: 'Failed to delete list',
    };
  }

  revalidatePath('/');

  return {
    success: true,
  };
}
