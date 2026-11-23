import { Component, signal } from '@angular/core';

import { Header } from './Components/header/header';
import { Main } from './Components/main/main';
import { Aside } from './Components/aside/aside';
import { Footer } from './Components/footer/footer';

@Component({
  imports: [Header, Main, Aside, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Empleo_Cerca');
}
