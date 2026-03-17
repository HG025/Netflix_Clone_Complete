import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { DialogServiceService } from '../../shared/services/dialog-service.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ErrorhandlerService } from '../../shared/services/errorhandler.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  paginatedUser: any = [];
  loading = true;
  loadingMore = false;
  error = false;
  currentUserEmail: string | null = null;
  searchQuery: string = '';

  pageSize = 3;
  currentPage = 0;
  totalPages = 0;
  totalUsers = 0;
  hasMoreUsers = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialogService: DialogServiceService,
    private notificationService: NotificationService,
    private errorHandlerService: ErrorhandlerService
  ) {

  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreUsers) {
      this.loadMoreUsers();
    }
  }



  loadUsers() {
    this.loading = true;
    this.error = false;
    this.currentPage = 0;
    this.paginatedUser = [];
    const search = this.searchQuery.trim() || undefined;

    this.userService.getAllUsers(this.currentPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.paginatedUser = response.content;
        this.totalUsers = response.totalElement;
        this.totalPages = response.TotalPages;
        this.currentPage = response.number;
        this.hasMoreUsers = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.errorHandlerService.handler(err, 'Failed to load Users.');
      }
    })
  }

  loadMoreUsers() {
    if (this.loadingMore || !this.hasMoreUsers) {
      return;
    }
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.userService.getAllUsers(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.paginatedUser = [...this.paginatedUser, ...response.content];
        this.currentPage = response.number;
         this.totalPages = response.TotalPages; 
        this.hasMoreUsers = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.loadingMore = false;
        this.errorHandlerService.handler(err, 'Failed to load more Users');
      }
    });
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 0;
    this.loadUsers();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadUsers();
  }

  createUser() {
    const dialogRef = this.dialogService.openManageUserDialog(`create`);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.loadUsers();
      }
    });
  }

  editUser(user: any) {
    const dialogRef = this.dialogService.openManageUserDialog(`edit`, user);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.loadUsers();
      }
    });
  }

  isCurrentUser(user: any): boolean {
    return user.email === this.currentUserEmail;
  }

  toggleUserStatus(user: any): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response: any) => {
        this.notificationService.success(response.message);
        this.loadUsers();
      },
      error: (err) => {
        this.errorHandlerService.handler(err, 'Failed to update user state');
      }
    })
  }

  deleteUser(user: any) {
    this.dialogService.openConfirmation(
      'Delete User?',
      `Are you sure you want to delete user "${user.fullname}"? This action cannot be undone.`,
      'Delete',
      'Cancel',
      'danger'
    ).subscribe(response => {
      if (response) {
        this.userService.deleteUser(user.id).subscribe({
          next: (response: any) => {
            this.notificationService.success(response?.message);
            this.loadUsers();
          },
          error: (err) => {
            this.errorHandlerService.handler(err, ' Failed to delete user');
          }
        })
      }
    })
  }


  changeUserRole(user: any) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    this.dialogService.openConfirmation(
      'Change User Role',
      `Are you sure you want to change ${user.fullname}'s role to ${newRole}?`,
      'Change Role',
      'Cancel',
      'warning'
    ).subscribe(response => {
      if (response) {
        this.userService.changeUserRole(user.id, newRole).subscribe({
          next: (response: any) => {
            this.notificationService.success(response?.message);
            this.loadUsers();
          },
          error: (err) => {
            this.errorHandlerService.handler(err, ' Failed to change user role')
          }
        })
      }
    })
  }


  getRoleBadgeClass(role: string): string {
    return role === 'ADMIN' ? 'role-badge admin' : 'role-badge user'
  }

  getStatusBadgeClass(active: boolean): string {
    return active ? 'status-badge active' : 'status-badge inactive';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserEmail = currentUser?.email || null;
    this.loadUsers();
  }


}
