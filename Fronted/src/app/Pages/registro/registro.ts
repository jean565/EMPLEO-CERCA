import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuario';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);

  contacto = '';
  contrasena = '';
  nombre = '';
  nombre_usuario = '';
  registrado = false;
  guardando = false;

  contactoValido(): boolean {
    const dato = this.contacto.trim();
    const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dato);
    const esCelular = /^9[0-9]{8}$/.test(dato);
    return esCorreo || esCelular;
  }

  guardar() {
    if (this.guardando) {
      return;
    }
    if (!this.contactoValido() || this.contrasena.length < 8 ||
        this.nombre.trim().length < 3 || this.nombre_usuario.trim().length < 3) {
      return;
    }

    this.guardando = true;
    this.usuarios.registrar({
      nombre: this.nombre.trim(),
      contacto: this.contacto.trim(),
      nombre_usuario: this.nombre_usuario.trim(),
      contrasena: this.contrasena
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.contrasena = '';
        this.registrado = true;
        Swal.fire({
          title: 'Cuenta creada',
          text: 'Tu cuenta de postulante fue registrada. Ya puedes iniciar sesión.',
          icon: 'success',
          confirmButtonColor: '#2563EB'
        }).then(() => this.router.navigate(['/login']));
      },
      error: (error: HttpErrorResponse) => {
        this.guardando = false;
        Swal.fire({
          title: 'No se pudo crear la cuenta',
          text: this.mensajeError(error),
          icon: 'error',
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }

  private mensajeError(error: HttpErrorResponse): string {
    const detalle = error.error?.detail;
    if (Array.isArray(detalle)) {
      return detalle.map((item: { msg?: string }) => item.msg || '').filter(Boolean).join(' ');
    }
    if (typeof detalle === 'string') {
      return detalle;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
    }
    return 'Revisa los datos e intenta nuevamente.';
  }
}
