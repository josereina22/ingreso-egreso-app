import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnInit() {

  }

  loginUsuario() {

    if (this.loginForm.invalid) return;

    Swal.fire({
      title: "Espere por favor",
      didOpen: () => {
        Swal.showLoading();

      }
    });

    const {  correo, password } = this.loginForm.value;
    this.authService.login(correo, password).then(
      credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      }
    ).catch(error => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    });

  }
}
