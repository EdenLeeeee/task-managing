import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * This service acts as a mock backend.
 *
 * You are free to modify it as you see.
 */

export type User = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  description: string;
  assigneeId: number;
  assignee?: string;
  completed: boolean;
};

function randomDelay() {
  return Math.random() * 1000;
}

@Injectable()
export class BackendService {
  storedTasks: Task[] = [
    {
      id: 0,
      description: 'Install a monitor arm',
      assigneeId: 111,
      assignee: 'Mike',
      completed: false
    },
    {
      id: 1,
      description: 'Move the desk to the new location',
      assigneeId: 111,
      assignee: 'Mike',
      completed: true
    }
  ];

  storedUsers: User[] = [{ id: 111, name: 'Mike' }, { id: 222, name: 'James' }];

  lastId = 1;
  taskSize = 100;

  constructor() {
    this.initTask();
  }

  private findTaskById = id => this.storedTasks.find(task => task.id === +id);

  private findUserById = id => this.storedUsers.find(user => user.id === +id);

  initTask() {
    for (let i = 0; i < this.taskSize; i++) {
      this.storedTasks.push({
        id: ++this.lastId,
        description: `test description ${this.lastId}`,
        assigneeId: null,
        completed: false
      });
    }
  }

  tasks() {
    return of(this.storedTasks).pipe(delay(randomDelay()));
  }

  task(id: number): Observable<Task> {
    return of(this.findTaskById(id)).pipe(delay(randomDelay()));
  }

  users() {
    return of(this.storedUsers).pipe(delay(randomDelay()));
  }

  user(id: number) {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTask(payload: { description: string }) {
    const newTask: Task = {
      id: ++this.lastId,
      description: payload.description,
      assigneeId: null,
      completed: false
    };

    this.storedTasks = [newTask,...this.storedTasks];

    return of(newTask).pipe(delay(randomDelay()));
  }

  assign(taskId: number, userId: number) {
    return this.update(taskId, { assigneeId: userId });
  }

  complete(taskId: number, completed: boolean) {
    return this.update(taskId, { completed });
  }

  update(taskId: number, updates: Partial<Omit<Task, 'id'>>) {
    const foundTask = this.findTaskById(taskId);

    if (!foundTask) {
      return throwError(new Error('task not found'));
    }

    const findUser = this.findUserById(updates.assigneeId || foundTask.assigneeId);

    const updatedTask = {
      ...foundTask,
      ...updates,
      ...{ assignee: findUser?.name }
    };

    this.storedTasks = this.storedTasks.map(
      t => (t.id === taskId ? updatedTask : t)
    );

    return of(updatedTask).pipe(delay(randomDelay()));
  }
}
