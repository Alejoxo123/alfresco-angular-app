import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AlfrescoChildrenResponse,
  AlfrescoNodeEntry,
} from '../models/alfresco.models';
import { environment } from '../enviroments/enviroment.development';

@Injectable({
  providedIn: 'root',
})
export class AlfrescoService {
  private readonly baseUrl = `${environment.alfrescoUrl}/alfresco/versions/1`;

  constructor(private http: HttpClient) {}

  private getTicket(): string {
    const ticket = localStorage.getItem('alf_ticket');
    if (!ticket) throw new Error('No hay ticket en localStorage');
    return ticket;
  }

  // Lista hijos de un nodo (carpetas y documentos)
  getChildren(nodeId: string = '-my-'): Observable<AlfrescoChildrenResponse> {
    const ticket = this.getTicket();
    const url = `${this.baseUrl}/nodes/${nodeId}/children?alf_ticket=${ticket}`;
    return this.http.get<AlfrescoChildrenResponse>(url);
  }

  // Obtiene info de un nodo específico
  getNode(nodeId: string): Observable<AlfrescoNodeEntry> {
    const ticket = this.getTicket();
    const url = `${this.baseUrl}/nodes/${nodeId}?alf_ticket=${ticket}`;
    return this.http.get<AlfrescoNodeEntry>(url);
  }

  // Actualiza solo el nombre del nodo
  updateName(nodeId: string, newName: string): Observable<AlfrescoNodeEntry> {
    const ticket = this.getTicket();
    const url = `${this.baseUrl}/nodes/${nodeId}?alf_ticket=${ticket}`;
    const body = { name: newName };
    return this.http.put<AlfrescoNodeEntry>(url, body);
  }

  // Crea carpeta hija de un nodo
  createFolder(parentId: string, folderName: string): Observable<AlfrescoNodeEntry> {
    const ticket = this.getTicket();
    const url = `${this.baseUrl}/nodes/${parentId}/children?alf_ticket=${ticket}`;
    const body = {
      name: folderName,
      nodeType: 'cm:folder',
    };
    return this.http.post<AlfrescoNodeEntry>(url, body);
  }

  // Crea un documento de texto vacío dentro de una carpeta
  createTextDocument(parentId: string, fileName: string): Observable<AlfrescoNodeEntry> {
    const ticket = this.getTicket();
    const url = `${this.baseUrl}/nodes/${parentId}/children?alf_ticket=${ticket}`;
    const body = {
      name: fileName,
      nodeType: 'cm:content',
    };
    return this.http.post<AlfrescoNodeEntry>(url, body);
  }

  // Actualiza el contenido de un documento de texto plano
  updateTextContent(nodeId: string, content: string): Observable<AlfrescoNodeEntry> {
    const ticket = this.getTicket();
    const url = `${this.baseUrl}/nodes/${nodeId}/content?alf_ticket=${ticket}`;
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
    });
    return this.http.put<AlfrescoNodeEntry>(url, content, { headers });
  }

  // Obtiene el contenido de un documento de texto plano
  getTextContent(nodeId: string): Observable<string> {
    const ticket = this.getTicket();
    const url = `${this.baseUrl}/nodes/${nodeId}/content?alf_ticket=${ticket}`;
    return this.http.get(url, { responseType: 'text' });
  }
}
