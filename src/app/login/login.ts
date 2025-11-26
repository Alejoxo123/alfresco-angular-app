import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class Login {
  loginForm: FormGroup;
  loading: boolean = false; 
  errorMessage: string = '';

  private authService = inject(Authentication);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      
      this.loading = true;

      // Realizar la petición al servicio de autenticación
      this.authService.authenticate(username, password).subscribe(
        (response) => {
          localStorage.setItem('alf_ticket', response.entry.id); 
          localStorage.setItem('alf_user', username);
          this.toastr.success('Inicio de sesion Exitoso'); 
          this.router.navigate(['/documents']); 
          this.loading = false; 
        },
        (error) => {
          this.toastr.error('Usuario y/o Contraseña incorrectas', 'Error'); 
          this.loading = false; 
        }
      );
    }
  }
}
