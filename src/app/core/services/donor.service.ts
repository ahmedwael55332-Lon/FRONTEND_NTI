import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Donor {
  _id: string;
  userId?: any;

  bloodType?: 'A' | 'B' | 'AB' | 'O';
  rh?: 'Positive' | 'Negative';

  phone?: string;
  address?: string;

  lastDonationDate?: string;
  nextEligibleDate?: string;

  isEligible?: boolean;
  isAvailable?: boolean;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
}

export interface DonorResponse {
  success: boolean;
  donor?: Donor;
  data?: Donor;
  message?: string;
}

export interface DonorsResponse {
  success: boolean;
  count?: number;
  donors: Donor[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  private apiUrl = `${environment.apiUrl}/donors`;

  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      data
    );
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/me`
    );
  }

  updateMyProfile(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/me`,
      data
    );
  }

  deleteMyProfile(): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/me`
    );
  }

  checkMyMedicalEligibility(): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/me/medical-check`,
      {}
    );
  }

  getAll(): Observable<DonorsResponse> {
    return this.http.get<DonorsResponse>(
      this.apiUrl
    );
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  update(
    id: string,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );
  }

  medicalCheck(id: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${id}/medical-check`,
      {}
    );
  }
}