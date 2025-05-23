import { Component } from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '04-ingresoEgresoApp';

  constructor(private readonly authService: AuthService) {
    this.authService.initAuthListener();
  }
}
