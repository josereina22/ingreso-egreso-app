import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import {Subscription} from 'rxjs';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  cargando: boolean = false;
  uiSuscription: Subscription = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly store: Store<AppState>,
    private readonly router: Router,
  ) {
    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      correo:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],

    });
  }

  ngOnInit() {
    this.uiSuscription = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading )
  }

  ngOnDestroy() {
    this.uiSuscription.unsubscribe();
  }

  crearUsuario() {

    if (this.registroForm.invalid) return;

    this.store.dispatch( ui.isLoading() );
    // Swal.fire({
    //   title: "Espere por favor",
    //   didOpen: () => {
    //     Swal.showLoading();
    //
    //   }
    // });

    const { nombre, correo, password } = this.registroForm.value;
    this.authService.crearUsuario(nombre, correo, password).then(
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
