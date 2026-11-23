import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../Services/usuario';
import Swal from 'sweetalert2';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  usuarios = inject(UsuarioService);
  router = inject(Router);
  correo = '';
  clave = '';

  entrar() {
    if (this.usuarios.iniciarDemo(this.correo, this.clave)) {
      sessionStorage.setItem('empleo_demo_admin', 'si');
      this.router.navigate(['/ofertas']);
    } else {
      Swal.fire({
        title: 'No se pudo iniciar sesión',
        text: 'Correo o contraseña incorrectos.',
        icon: 'error',
        confirmButtonColor: '#2563EB'
      });
    }
  }
}
