import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  constructor(private router: Router) {}

  get esAdmin(): boolean {
    return typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('empleo_demo_admin') === 'si';
  }

  salir() {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('empleo_demo_admin');
    this.router.navigate(['/inicio']);
  }
}
