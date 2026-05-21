/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'in-progress' | 'done';

export type Role = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: string;
  dueDate: string;
  createdAt: string;
  assignedTo?: string; // User ID
  createdBy: string; // User ID
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
