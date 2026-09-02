import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type BloodType = 'A' | 'B' | 'AB' | 'O';

export type RhType = 'Positive' | 'Negative';

export type UrgencyType = 'normal' | 'emergency';

export type BloodRequestStatus =
  | 'pending'
  | 'matched'
  | 'completed'
  | 'cancelled';

export interface BloodRequest {
  _id: string;
  userId: any;
  bloodType: BloodType;
  rh: RhType;
  urgency: UrgencyType;
  status: BloodRequestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBloodRequest {
  bloodType: BloodType;
  rh: RhType;
  urgency: UrgencyType;
}

export interface UpdateBloodRequest {
  bloodType?: BloodType;
  rh?: RhType;
  urgency?: UrgencyType;
  status?: BloodRequestStatus;
}

export interface BloodRequestsResponse {
  success: boolean;
  count: number;
  bloodRequests: BloodRequest[];
}

export interface BloodRequestResponse {
  success: boolean;
  message: string;
  bloodRequest: BloodRequest;
}

export interface BloodRequestMatchesResponse {
  success: boolean;
  request: {
    id: string;
    bloodType: BloodType;
    rh: RhType;
    urgency: UrgencyType;
    status: BloodRequestStatus;
  };
  compatibility: {
    bloodTypes: BloodType[];
    rh: RhType[];
  };
  count: number;
  donors: any[];
}

@Injectable({
  providedIn: 'root'
})
export class BloodRequestService {

  private readonly apiUrl =
    `${environment.apiUrl}/blood-requests`;

  constructor(
    private http: HttpClient
  ) {}

  // GET /blood-requests
  getAll(): Observable<BloodRequestsResponse> {
    return this.http.get<BloodRequestsResponse>(
      this.apiUrl
    );
  }

  // GET /blood-requests/:id
  getById(id: string): Observable<BloodRequestResponse> {
    return this.http.get<BloodRequestResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST /blood-requests
  create(
    data: CreateBloodRequest
  ): Observable<BloodRequestResponse> {
    return this.http.post<BloodRequestResponse>(
      this.apiUrl,
      data
    );
  }

  // PUT /blood-requests/:id
  update(
    id: string,
    data: UpdateBloodRequest
  ): Observable<BloodRequestResponse> {
    return this.http.put<BloodRequestResponse>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // DELETE /blood-requests/:id
  delete(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );
  }

  // GET /blood-requests/:id/matches
  getMatches(
    id: string
  ): Observable<BloodRequestMatchesResponse> {
    return this.http.get<BloodRequestMatchesResponse>(
      `${this.apiUrl}/${id}/matches`
    );
  }
}