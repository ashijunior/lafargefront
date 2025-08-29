import { Component, HostListener, OnInit } from '@angular/core';
import { AppServiceService } from '../Service/app-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users: any[] = [];
  roles: any[] = [];
  showCreateModal = false;
  showEditModal = false;
  editUser: any = null;
  searchKeyword: string = '';
  multiSelectMode = false;
  selectedUsers: any[] = [];
  pressTimer: any;
  isMobile: boolean = false;
  editUserFile: File | null = null;
  newUser: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    roleId: '',
    picture: null
  };

  constructor(private appService: AppServiceService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  this.checkIfMobile();
  }

  getRoles() {
    this.appService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        console.log('Roles:', data);
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  getUsers() {
    this.appService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users:', data);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetNewUser();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.newUser.picture = event.target.files[0];
    }
  }

  resetNewUser() {
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      nationality: '',
      roleId: '',
      picture: null
    };
  }

  createUser() {
    const formData = new FormData();
    formData.append('firstName', this.newUser.firstName);
    formData.append('lastName', this.newUser.lastName);
    formData.append('email', this.newUser.email);
    formData.append('phone', this.newUser.phone);
    formData.append('gender', this.newUser.gender);
    formData.append('dateOfBirth', this.newUser.dateOfBirth);
    formData.append('nationality', this.newUser.nationality);
    formData.append('roleId', this.newUser.roleId);
    if (this.newUser.picture) {
      formData.append('picture', this.newUser.picture);
    }

    this.appService.createUser(formData).subscribe({
      next: (res) => {
        console.log('User created:', res);
        this.getUsers(); 
        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Error creating user:', err);
      }
    });
  }

  openEditModal(user: any) {
    this.editUser = { ...user };
    this.editUserFile = null;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editUser = null;
    this.editUserFile = null;
  }

  onEditFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.editUserFile = event.target.files[0];
    }
  }
  
  updateUser() {
    const formData = new FormData();
    formData.append('id', this.editUser.id);
    formData.append('firstName', this.editUser.firstName);
    formData.append('lastName', this.editUser.lastName);
    formData.append('email', this.editUser.email);
    formData.append('phone', this.editUser.phone);
    formData.append('gender', this.editUser.gender);
    formData.append('dateOfBirth', this.editUser.dateOfBirth);
    formData.append('nationality', this.editUser.nationality);
    formData.append('roleId', this.editUser.roleId);
    if (this.editUserFile) {
      formData.append('picture', this.editUserFile);
    }
    
    this.appService.updateUser(this.editUser.id, formData).subscribe({
      next: (res) => {
        console.log('User updated:', res);
        this.getUsers(); 
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
  
  deleteUser(userId: number) {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    this.appService.deleteUser(userId).subscribe({
      next: () => {
        console.log(`User with ID ${userId} deleted.`);
        this.getUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }
  
  onSearch(event: any) {
    this.searchKeyword = event.target.value.trim();

    if (this.searchKeyword === '') {
      this.getUsers();
      return;
    }

    this.appService.searchUsers(this.searchKeyword).subscribe({
      next: (data) => {
        this.users = data;
        console.log('Search results:', data);
      },
      error: (err) => {
        console.error('Error searching users:', err);
      }
    });
  }

  enableMultiSelect() {
    this.multiSelectMode = true;
  }

  updateSelectedUsers(user: any) {
    if (user.selected) {
      if (!this.selectedUsers.includes(user.id)) this.selectedUsers.push(user.id);
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== user.id);
    }
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.users.forEach(u => {
      u.selected = checked;
      this.updateSelectedUsers(u);
   });
  }

  startPress(event: any, user: any) {
    if (!this.multiSelectMode) {
      this.pressTimer = setTimeout(() => {
        this.multiSelectMode = true;
        user.selected = true;
        this.updateSelectedUsers(user);
      }, 500);
    }
  }

  cancelPress() {
    clearTimeout(this.pressTimer);
  }

  deleteSelectedUsers() {
    if (this.selectedUsers.length === 0) return;
    const confirmed = confirm(`Are you sure you want to delete ${this.selectedUsers.length} users?`);
    if (!confirmed) return;

    this.appService.deleteMultipleUsers(this.selectedUsers).subscribe({
      next: () => {
        console.log('Deleted users:', this.selectedUsers);
        this.selectedUsers = [];
        this.multiSelectMode = false;
        this.getUsers();
      },
      error: (err) => console.error('Error deleting users:', err)
    });
  }
  cancelMultiSelect() {
    this.multiSelectMode = false;
    this.selectedUsers = [];
    this.users.forEach(u => u.selected = false);
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768; // or any breakpoint you want
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }
}
