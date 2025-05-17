import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor() {
    console.log('LoginComponent cargado');
  }

  ngOnInit() {
    console.log('LoginComponent cargado');
  }

}
