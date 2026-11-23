import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuario';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  usuarios = inject(UsuarioService);
  contacto = '';
  contrasena = '';
  nombre = '';
  nombreUsuario = '';
  registrado = false;

  contactoValido(): boolean {
    const dato = this.contacto.trim();
    const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dato);
    const esCelular = /^9[0-9]{8}$/.test(dato);
    return esCorreo || esCelular;
  }

  guardar() {
    if (!this.contactoValido() || this.contrasena.length < 6 ||
        this.nombre.trim().length < 3 || this.nombreUsuario.trim().length < 3) return;
    this.usuarios.registrar({
      nombre: this.nombre.trim(),
      contacto: this.contacto.trim(),
      nombreUsuario: this.nombreUsuario.trim()
    });
    this.contrasena = '';
    this.registrado = true;
    Swal.fire({
      title: 'Formulario completado',
      text: 'Los datos se validaron correctamente.',
      icon: 'success',
      confirmButtonColor: '#2563EB'
    });
  }
}
