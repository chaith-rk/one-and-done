/**
 * Zod Validation Schemas for One and Done
 * Used for runtime validation of user inputs
 */

import { z } from 'zod';

// =====================================================
// USER PROFILE SCHEMAS
// =====================================================
export const createUserProfileSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  name: z.string().max(255, 'Name too long').nullable().optional(),
  phone: z.string().max(20, 'Phone number too long').nullable().optional(),
});

export const updateUserProfileSchema = z.object({
  name: z.string().max(255, 'Name too long').nullable().optional(),
  phone: z.string().max(20, 'Phone number too long').nullable().optional(),
});

// =====================================================
// LIST SCHEMAS
// =====================================================
export const createListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name too long')
    .trim(),
  is_inbox: z.boolean().optional().default(false),
});

export const updateListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name too long')
    .trim()
    .optional(),
});

// =====================================================
// TASK SCHEMAS
// =====================================================
export const createTaskSchema = z.object({
  list_id: z.string().uuid('Invalid list ID'),
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(500, 'Task title too long')
    .trim(),
  description: z.string().max(5000, 'Description too long').nullable().optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)')
    .nullable()
    .optional(),
  due_time: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format (use HH:MM or HH:MM:SS)')
    .nullable()
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(500, 'Task title too long')
    .trim()
    .optional(),
  description: z.string().max(5000, 'Description too long').nullable().optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)')
    .nullable()
    .optional(),
  due_time: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format (use HH:MM or HH:MM:SS)')
    .nullable()
    .optional(),
  completed: z.boolean().optional(),
});

// =====================================================
// BULK OPERATION SCHEMAS
// =====================================================
export const bulkDeleteTasksSchema = z.object({
  task_ids: z
    .array(z.string().uuid('Invalid task ID'))
    .min(1, 'At least one task ID is required')
    .max(100, 'Cannot delete more than 100 tasks at once'),
});

export const bulkCompleteTasksSchema = z.object({
  task_ids: z
    .array(z.string().uuid('Invalid task ID'))
    .min(1, 'At least one task ID is required')
    .max(100, 'Cannot complete more than 100 tasks at once'),
  completed: z.boolean(),
});

// =====================================================
// QUERY FILTER SCHEMAS
// =====================================================
export const taskFilterSchema = z.enum(['all', 'active', 'completed']);

export const taskSortBySchema = z.enum(['created_at', 'due_date']);

export const taskQueryOptionsSchema = z.object({
  list_id: z.string().uuid('Invalid list ID'),
  filter: taskFilterSchema.optional().default('all'),
  sort_by: taskSortBySchema.optional().default('created_at'),
});
