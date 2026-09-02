import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  updateMe(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, data);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}