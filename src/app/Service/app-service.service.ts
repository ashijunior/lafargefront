import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private baseUrl = 'https://localhost:7208/api/User/';
  private url = 'https://localhost:7208/api/Role/';

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.url}GetRoles`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}GetAllUsers`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}GetUserById/${id}`);
  }

  createUser(userData: FormData) {
    return this.http.post<any>(`${this.baseUrl}CreateUser`, userData);
  }

  updateUser(id: number, userData: FormData) {
    return this.http.put<any>(`${this.baseUrl}UpdateUser/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}DeleteUser/${id}`);
  }

  searchUsers(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}SearchUsers?keyword=${keyword}`);
  }

  deleteMultipleUsers(ids: number[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}DeleteMultipleUsers`, ids);
  }
}
