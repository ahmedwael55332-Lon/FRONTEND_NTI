import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type BloodType = 'A' | 'B' | 'AB' | 'O';

export type RhType = 'Positive' | 'Negative';

export type BloodUnitStatus =
  | 'Available'
  | 'Reserved'
  | 'Released'
  | 'Expired';

export interface BloodUnit {
  _id: string;
  bloodType: BloodType;
  rh: RhType;
  collectionDate: string;
  expirationDate: string;
  status: BloodUnitStatus;
  releasedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBloodUnit {
  bloodType: BloodType;
  rh: RhType;
  collectionDate: string;
  expirationDate: string;
  status?: BloodUnitStatus;
}

export interface BloodUnitsResponse {
  success: boolean;
  count: number;
  bloodUnits: BloodUnit[];
}

export interface BloodUnitResponse {
  success: boolean;
  message: string;
  bloodUnit: BloodUnit;
}

@Injectable({
  providedIn: 'root'
})
export class BloodUnitService {

  private readonly apiUrl =
    `${environment.apiUrl}/blood-units`;

  constructor(
    private http: HttpClient
  ) {}

  // GET /blood-units
  getAll(): Observable<BloodUnitsResponse> {
    return this.http.get<BloodUnitsResponse>(
      this.apiUrl
    );
  }

  // GET /blood-units/:id
  getById(id: string): Observable<BloodUnitResponse> {
    return this.http.get<BloodUnitResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST /blood-units
  create(
    data: CreateBloodUnit
  ): Observable<BloodUnitResponse> {
    return this.http.post<BloodUnitResponse>(
      this.apiUrl,
      data
    );
  }

  // PUT /blood-units/:id
  update(
    id: string,
    data: Partial<CreateBloodUnit>
  ): Observable<BloodUnitResponse> {
    return this.http.put<BloodUnitResponse>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // DELETE /blood-units/:id
  delete(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );
  }

  // PATCH /blood-units/:id/release
  release(id: string): Observable<BloodUnitResponse> {
    return this.http.patch<BloodUnitResponse>(
      `${this.apiUrl}/${id}/release`,
      {}
    );
  }
}