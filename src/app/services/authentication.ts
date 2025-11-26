import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private baseUrl = `${environment.alfrescoUrl}/authentication/versions/1/tickets`;

  constructor(private http: HttpClient) {}

  // Autenticación (login)
  authenticate(username: string, password: string): Observable<any> {
    const body = { userId: username, password: password };
    return this.http.post<any>(this.baseUrl, body);
  }

  // Cerrar sesión (invalidar ticket)
  logout(ticket: string): Observable<any> {
    const url = `${this.baseUrl}/-me-?alf_ticket=${ticket}`;
    return this.http.delete<any>(url);
  }
}
