import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuario';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  contacto = '';
  clave = '';
  ingresando = false;

  get returnUrl(): string {
    return this.ruta.snapshot.queryParamMap.get('returnUrl') || '';
  }

  entrar() {
    if (this.ingresando || !this.contacto.trim() || !this.clave) {
      return;
    }

    this.ingresando = true;
    this.usuarios.iniciarSesion(this.contacto.trim(), this.clave).subscribe({
      next: () => {
        this.ingresando = false;
        const destino = this.returnUrl.startsWith('/') ? this.returnUrl : '/ofertas';
        this.router.navigateByUrl(destino);
      },
      error: (error: HttpErrorResponse) => {
        this.ingresando = false;
        const mensaje = this.mensajeError(error);
        Swal.fire({
          title: 'No se pudo iniciar sesión',
          text: mensaje,
          icon: 'error',
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }

  private mensajeError(error: HttpErrorResponse): string {
    const detalle = error.error?.detail;
    if (typeof detalle === 'string') {
      return detalle;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
    }
    return 'Revisa tu correo, celular o contraseña.';
  }
}
