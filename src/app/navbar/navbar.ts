import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Authentication } from '../services/authentication'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private auth = inject(Authentication);

  userName = 'Usuario';
  userRole = 'Usuario Alfresco';

  showUserMenu = false;
  showNavbar = true; 

  get userInitial(): string {
    return (this.userName || 'U').charAt(0).toUpperCase();
  }

  ngOnInit(): void {
    // Leer usuario desde localStorage si existe
    const storedUser = localStorage.getItem('alf_user');
    if (storedUser) {
      this.userName = storedUser;
    }

    // Mostrar / ocultar navbar según ruta 
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.showNavbar = !event.urlAfterRedirects.startsWith('/login');
      });
  }

  openUserMenu(): void {
    if (!this.showNavbar) return;
    this.showUserMenu = true;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

    logout(): void {
    this.showUserMenu = false;

    const ticket = localStorage.getItem('alf_ticket');

    // Si no hay ticket, al menos se limpia sesión local
    if (!ticket) {
      localStorage.removeItem('alf_user');
      this.toastr.info('Sesión cerrada');
      this.router.navigate(['/login']);
      return;
    }

    // Llamamos al endpoint de Alfresco para invalidar el ticket
    this.auth.logout(ticket).subscribe({
      next: () => {
        localStorage.removeItem('alf_ticket');
        localStorage.removeItem('alf_user');
        this.toastr.info('Sesión cerrada');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Aunque falle el backend, se limpia la sesión local
        console.error('Error al cerrar sesión en Alfresco', err);
        localStorage.removeItem('alf_ticket');
        localStorage.removeItem('alf_user');
        this.toastr.warning(
          'No se pudo notificar el cierre de sesión a Alfresco, pero se cerró localmente.',
          'Aviso'
        );
        this.router.navigate(['/login']);
      },
    });
  }

}
