'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  createTaskSchema,
  updateTaskSchema,
  bulkDeleteTasksSchema,
  bulkCompleteTasksSchema,
  taskQueryOptionsSchema,
} from '@/lib/validations';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  BulkDeleteTasksInput,
  BulkCompleteTasksInput,
  TaskQueryOptions,
} from '@/types/database.types';

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get tasks for a specific list with optional filtering and sorting
 */
export async function getTasks(options: TaskQueryOptions): Promise<ActionResult<Task[]>> {
  // Validate input
  const validation = taskQueryOptionsSchema.safeParse(options);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid query options',
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

  // Verify list belongs to user
  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('id')
    .eq('id', validation.data.list_id)
    .eq('user_id', user.id)
    .single();

  if (listError || !list) {
    return {
      success: false,
      error: 'List not found',
    };
  }

  // Build query
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('list_id', validation.data.list_id);

  // Apply filter
  if (validation.data.filter === 'active') {
    query = query.eq('completed', false);
  } else if (validation.data.filter === 'completed') {
    query = query.eq('completed', true);
  }

  // Apply sorting
  if (validation.data.sort_by === 'due_date') {
    // Sort by due date (nulls last), then by created_at
    query = query
      .order('due_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });
  } else {
    // Default: Sort by created_at (newest first)
    query = query.order('created_at', { ascending: false });
  }

  // For completed tasks, always show at bottom
  // This is handled in the UI layer by sorting completed to bottom

  const { data, error } = await query;

  if (error) {
    return {
      success: false,
      error: 'Failed to fetch tasks',
    };
  }

  return {
    success: true,
    data: data as Task[],
  };
}

/**
 * Get a single task by ID
 */
export async function getTaskById(taskId: string): Promise<ActionResult<Task>> {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Fetch task
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) {
    return {
      success: false,
      error: 'Task not found',
    };
  }

  // RLS will ensure user can only access their own tasks
  return {
    success: true,
    data: data as Task,
  };
}

/**
 * Create a new task
 */
export async function createTask(input: CreateTaskInput): Promise<ActionResult<Task>> {
  // Validate input
  const validation = createTaskSchema.safeParse(input);

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

  // Verify list belongs to user
  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('id')
    .eq('id', validation.data.list_id)
    .eq('user_id', user.id)
    .single();

  if (listError || !list) {
    return {
      success: false,
      error: 'List not found',
    };
  }

  // Create task
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      list_id: validation.data.list_id,
      title: validation.data.title,
      description: validation.data.description || null,
      due_date: validation.data.due_date || null,
      due_time: validation.data.due_time || null,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to create task',
    };
  }

  revalidatePath('/');

  return {
    success: true,
    data: data as Task,
  };
}

/**
 * Update an existing task
 */
export async function updateTask(
  taskId: string,
  input: UpdateTaskInput
): Promise<ActionResult<Task>> {
  // Validate input
  const validation = updateTaskSchema.safeParse(input);

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

  // Build update object (only include provided fields)
  const updateData: Partial<Task> = {};
  if (validation.data.title !== undefined) updateData.title = validation.data.title;
  if (validation.data.description !== undefined) updateData.description = validation.data.description;
  if (validation.data.due_date !== undefined) updateData.due_date = validation.data.due_date;
  if (validation.data.due_time !== undefined) updateData.due_time = validation.data.due_time;
  if (validation.data.completed !== undefined) updateData.completed = validation.data.completed;

  // Update task
  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to update task',
    };
  }

  // RLS will ensure user can only update their own tasks

  revalidatePath('/');

  return {
    success: true,
    data: data as Task,
  };
}

/**
 * Delete a task (hard delete with no recovery)
 */
export async function deleteTask(taskId: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Delete task
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    return {
      success: false,
      error: 'Failed to delete task',
    };
  }

  // RLS will ensure user can only delete their own tasks

  revalidatePath('/');

  return {
    success: true,
  };
}

/**
 * Toggle task completion status
 */
export async function toggleTaskCompletion(taskId: string): Promise<ActionResult<Task>> {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Get current task state
  const { data: task, error: fetchError } = await supabase
    .from('tasks')
    .select('completed')
    .eq('id', taskId)
    .single();

  if (fetchError || !task) {
    return {
      success: false,
      error: 'Task not found',
    };
  }

  // Toggle completion
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: !task.completed })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: 'Failed to update task',
    };
  }

  revalidatePath('/');

  return {
    success: true,
    data: data as Task,
  };
}

/**
 * Bulk delete tasks (hard delete with no recovery)
 */
export async function bulkDeleteTasks(input: BulkDeleteTasksInput): Promise<ActionResult> {
  // Validate input
  const validation = bulkDeleteTasksSchema.safeParse(input);

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

  // Delete tasks
  const { error } = await supabase
    .from('tasks')
    .delete()
    .in('id', validation.data.task_ids);

  if (error) {
    return {
      success: false,
      error: 'Failed to delete tasks',
    };
  }

  // RLS will ensure user can only delete their own tasks

  revalidatePath('/');

  return {
    success: true,
  };
}

/**
 * Bulk complete/uncomplete tasks
 */
export async function bulkCompleteTasks(input: BulkCompleteTasksInput): Promise<ActionResult> {
  // Validate input
  const validation = bulkCompleteTasksSchema.safeParse(input);

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

  // Update tasks
  const { error } = await supabase
    .from('tasks')
    .update({ completed: validation.data.completed })
    .in('id', validation.data.task_ids);

  if (error) {
    return {
      success: false,
      error: 'Failed to update tasks',
    };
  }

  // RLS will ensure user can only update their own tasks

  revalidatePath('/');

  return {
    success: true,
  };
}
