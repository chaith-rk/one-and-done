/**
 * Database Types for One and Done
 * Generated from Supabase schema: 001_initial_schema.sql
 */

// =====================================================
// USER PROFILES
// =====================================================
export interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateUserProfileInput = Pick<UserProfile, 'user_id'> & {
  name?: string | null;
  phone?: string | null;
};

export type UpdateUserProfileInput = Partial<Pick<UserProfile, 'name' | 'phone'>>;

// =====================================================
// LISTS
// =====================================================
export interface List {
  id: string;
  user_id: string;
  name: string;
  is_inbox: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateListInput = Pick<List, 'name'> & {
  is_inbox?: boolean;
};

export type UpdateListInput = Partial<Pick<List, 'name'>>;

// =====================================================
// TASKS
// =====================================================
export interface Task {
  id: string;
  list_id: string;
  title: string;
  description: string | null;
  due_date: string | null; // ISO date string (YYYY-MM-DD)
  due_time: string | null; // Time string (HH:MM:SS)
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

export type CreateTaskInput = Pick<Task, 'list_id' | 'title'> & {
  description?: string | null;
  due_date?: string | null;
  due_time?: string | null;
};

export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'due_date' | 'due_time' | 'completed'>>;

// =====================================================
// BULK OPERATIONS
// =====================================================
export interface BulkDeleteTasksInput {
  task_ids: string[];
}

export interface BulkCompleteTasksInput {
  task_ids: string[];
  completed: boolean;
}

// =====================================================
// QUERY FILTERS
// =====================================================
export type TaskFilter = 'all' | 'active' | 'completed';

export type TaskSortBy = 'created_at' | 'due_date';

export interface TaskQueryOptions {
  list_id: string;
  filter?: TaskFilter;
  sort_by?: TaskSortBy;
}
