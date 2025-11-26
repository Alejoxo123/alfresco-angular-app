import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AlfrescoService } from '../services/alfresco';
import { AlfrescoNodeEntry } from '../models/alfresco.models';

interface Breadcrumb {
  id: string;
  name: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
  imports: [CommonModule, FormsModule],
})
export class Documents implements OnInit {
  private alfresco = inject(AlfrescoService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  loading = false;

  currentNodeId = '-my-';
  currentNodeName = 'Mis documentos';
  items: AlfrescoNodeEntry[] = [];

  breadcrumbs: Breadcrumb[] = [{ id: '-my-', name: 'Mis documentos' }];

  // creación de carpeta
  showCreateFolder = false;
  newFolderName = '';

  // creación de documento
  showCreateDoc = false;
  newDocName = '';

  // edición de contenido
  showEditContent = false;
  contentNodeId: string | null = null;
  contentNodeName = '';
  contentText = '';

  // edición de nombre
  showEditName = false;
  editNameNodeId: string | null = null;
  editNameValue = '';
  editNameOriginal = '';

  ngOnInit(): void {
    this.loadChildren(this.currentNodeId);
  }

  // carga de nodos
  loadChildren(nodeId: string, pushBreadcrumb: boolean = false, name?: string): void {
    this.loading = true;
    this.alfresco.getChildren(nodeId).subscribe({
      next: (resp) => {
        this.items = resp.list.entries.map((e) => ({
          entry: {
            ...e.entry,
            isFolder: e.entry.isFolder ?? e.entry.nodeType === 'cm:folder',
            isFile: e.entry.isFile ?? e.entry.nodeType === 'cm:content',
          },
        }));

        this.currentNodeId = nodeId;

        if (pushBreadcrumb && name) {
          this.breadcrumbs.push({ id: nodeId, name });
        }

        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.toastr.error('Sesión expirada. Vuelve a iniciar sesión.', 'Autenticación');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error('Error al cargar el contenido', 'Error');
        }
        this.loading = false;
      },
    });
  }

  // navegación carpetas
  openFolder(node: AlfrescoNodeEntry): void {
    if (!node.entry.isFolder) return;
    this.loadChildren(node.entry.id, true, node.entry.name);
  }

  goToBreadcrumb(crumb: Breadcrumb, index: number): void {
    this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
    this.loadChildren(crumb.id);
  }

  goBack(): void {
    if (this.breadcrumbs.length <= 1) return;
    this.breadcrumbs.pop();
    const last = this.breadcrumbs[this.breadcrumbs.length - 1];
    this.loadChildren(last.id);
  }

  // editar nombre (modal dentro del mismo componente)
  editName(node: AlfrescoNodeEntry): void {
      if (!node.entry.isFile && !node.entry.isFolder) return;

    this.editNameNodeId = node.entry.id;
    this.editNameOriginal = node.entry.name;
    this.editNameValue = node.entry.name;
    this.showEditName = true;
  }

  saveName(): void {
    if (!this.editNameNodeId || !this.editNameValue.trim()) return;

    const newName = this.editNameValue.trim();

    this.loading = true;
    this.alfresco.updateName(this.editNameNodeId, newName).subscribe({
      next: () => {
        // Actualizamos la lista en memoria
        const idx = this.items.findIndex((item) => item.entry.id === this.editNameNodeId);
        if (idx >= 0) {
          this.items[idx] = {
            entry: {
              ...this.items[idx].entry,
              name: newName,
            },
          };
        }

        this.toastr.success('Nombre actualizado');
        this.showEditName = false;
        this.editNameNodeId = null;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('No se pudo actualizar el nombre', 'Error');
        this.loading = false;
      },
    });
  }

  // crear carpeta 
  openCreateFolder(): void {
    this.newFolderName = '';
    this.showCreateFolder = true;
  }

  createFolder(): void {
    if (!this.newFolderName.trim()) return;

    this.loading = true;
    this.alfresco.createFolder(this.currentNodeId, this.newFolderName.trim()).subscribe({
      next: (resp) => {
        this.toastr.success('Carpeta creada');
        const normalized: AlfrescoNodeEntry = {
          entry: {
            ...resp.entry,
            isFolder: resp.entry.isFolder ?? resp.entry.nodeType === 'cm:folder',
            isFile: resp.entry.isFile ?? resp.entry.nodeType === 'cm:content',
          },
        };
        this.items.unshift(normalized);
        this.showCreateFolder = false;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('No se pudo crear la carpeta', 'Error');
        this.loading = false;
      },
    });
  }

  // crear documento de texto 
  openCreateDoc(): void {
    this.newDocName = '';
    this.showCreateDoc = true;
  }

  createDoc(): void {
    if (!this.newDocName.trim()) return;

    const fileName = this.newDocName.endsWith('.txt')
      ? this.newDocName.trim()
      : `${this.newDocName.trim()}.txt`;

    this.loading = true;
    this.alfresco.createTextDocument(this.currentNodeId, fileName).subscribe({
      next: (resp) => {
        this.toastr.success('Documento creado');
        const normalized: AlfrescoNodeEntry = {
          entry: {
            ...resp.entry,
            isFolder: resp.entry.isFolder ?? resp.entry.nodeType === 'cm:folder',
            isFile: resp.entry.isFile ?? resp.entry.nodeType === 'cm:content',
          },
        };
        this.items.unshift(normalized);
        this.showCreateDoc = false;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('No se pudo crear el documento', 'Error');
        this.loading = false;
      },
    });
  }

  // editar contenido de documento de texto
  openEditContent(node: AlfrescoNodeEntry): void {
    if (!node.entry.isFile) return;

    this.contentNodeId = node.entry.id;
    this.contentNodeName = node.entry.name;
    this.contentText = '';
    this.showEditContent = true;

    // Cargamos el contenido actual
    this.loading = true;
    this.alfresco.getTextContent(node.entry.id).subscribe({
      next: (text) => {
        this.contentText = text || '';
        this.loading = false;
      },
      error: () => {
        this.toastr.warning(
          'No se pudo cargar el contenido actual. Puedes escribir nuevo contenido.',
          'Aviso'
        );
        this.loading = false;
      },
    });
  }

  saveContent(): void {
    if (!this.contentNodeId) return;

    this.loading = true;
    this.alfresco.updateTextContent(this.contentNodeId, this.contentText).subscribe({
      next: () => {
        this.toastr.success('Contenido actualizado');
        this.showEditContent = false;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('No se pudo actualizar el contenido', 'Error');
        this.loading = false;
      },
    });
  }
}
