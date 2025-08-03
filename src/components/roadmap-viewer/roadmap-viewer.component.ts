import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-roadmap-viewer',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <app-notification></app-notification>
      
      <nav class="navbar py-4">
        <div class="container">
          <div class="flex justify-between items-center">
            <div class="navbar-brand">TaskManager Pro</div>
            <div class="flex items-center gap-4">
              <span class="text-gray-600 font-medium">Welcome, {{ currentUser?.username }}!</span>
              <button class="btn btn-secondary btn-sm" (click)="logout()">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div class="container">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-4 py-8">
            <button class="btn btn-outline" (click)="goBack()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Dashboard
            </button>
            <div>
              <h1 class="text-4xl font-bold text-gray-900 mb-2">Task Roadmap</h1>
              <p class="text-gray-600">AI-generated roadmap for your task</p>
            </div>
          </div>

          <div *ngIf="isLoading" class="text-center py-12">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-gray-600">Loading roadmap...</p>
          </div>

          <div *ngIf="task && !isLoading" class="space-y-6">
            <div class="card">
              <div class="card-body">
                <div class="flex justify-between items-start mb-6">
                  <div class="flex-1">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ task.title }}</h2>
                    <p class="text-gray-600 mb-4">{{ task.description }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="priority-badge" [class]="task.priority.toLowerCase()">
                        {{ task.priority }}
                      </span>
                      <span *ngIf="task.dueDate" class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Due: {{ task.dueDate | date:'MMM d, y h:mm a' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card" *ngIf="task.roadmap">
              <div class="card-body">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">AI-Generated Roadmap</h3>
                    <p class="text-gray-600">Step-by-step guide to complete your task</p>
                  </div>
                </div>
                
                <div class="prose prose-lg max-w-none">
                  <div class="bg-gray-50 rounded-lg p-6 border">
                    <pre class="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{{ task.roadmap }}</pre>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="!task.roadmap" class="card">
              <div class="card-body text-center py-12">
                <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No roadmap available</h3>
                <p class="text-gray-600 mb-4">This task doesn't have an AI-generated roadmap yet.</p>
                <button class="btn btn-primary" (click)="editTask()">
                  Edit Task to Add Roadmap
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="!task && !isLoading" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Task not found</h3>
            <p class="text-gray-600">The task you're looking for doesn't exist or has been deleted.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .leading-relaxed { line-height: 1.625; }
    .whitespace-pre-wrap { white-space: pre-wrap; }
    .prose-lg { font-size: 1.125rem; line-height: 1.7; }
    .prose { max-width: none; }
    .h-20 { height: 5rem; }
    .w-20 { width: 5rem; }
    .h-10 { height: 2.5rem; }
    .w-10 { width: 2.5rem; }
    .h-8 { height: 2rem; }
    .w-8 { width: 2rem; }
    .h-6 { height: 1.5rem; }
    .w-6 { width: 1.5rem; }
    .h-5 { height: 1.25rem; }
    .w-5 { width: 1.25rem; }
    .h-4 { height: 1rem; }
    .w-4 { width: 1rem; }
  `]
})
export class RoadmapViewerComponent implements OnInit {
  currentUser: User | null = null;
  task: Task | null = null;
  taskId: number = 0;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTask();
  }

  loadTask() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = parseInt(id, 10);
      this.isLoading = true;
      
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          this.task = task;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading task:', error);
          this.isLoading = false;
        }
      });
    }
  }

  editTask() {
    this.router.navigate(['/edit-task', this.taskId]);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}