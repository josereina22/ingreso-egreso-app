import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2'
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSuscription: Subscription = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly store: Store<AppState>,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.uiSuscription = this.store.select('ui').subscribe( ui => {
      console.log('Cargando...');
      this.cargando = ui.isLoading
    })
  }

  ngOnDestroy() {
    this.uiSuscription.unsubscribe();
  }

  loginUsuario() {

    if (this.loginForm.invalid) return;

    this.store.dispatch( ui.isLoading() );

    // Swal.fire({
    //   title: "Espere por favor",
    //   didOpen: () => {
    //     Swal.showLoading();
    //
    //   }
    // });

    const {  correo, password } = this.loginForm.value;
    this.authService.login(correo, password).then(
      credenciales => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch( ui.stopLoading() );
        this.router.navigate(['/']);
      }
    ).catch(error => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    });

  }
}
