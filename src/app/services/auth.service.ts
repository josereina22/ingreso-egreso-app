import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { authState } from 'rxfire/auth'; // 👈 Aquí está la magia
import {map, Observable, Subscription} from 'rxjs';
import {Usuario} from '../models/usuario.model';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import {docData} from 'rxfire/firestore';
import {FirestoreUserData} from '../models/firestore-user-data.interface';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;
  userSubscription: Subscription = new Subscription();

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
    private readonly store:Store<AppState>,
  ) {
    this.user$ = authState(this.auth); // 👈 Observable que emite cam
  }

  initAuthListener() {
    // return new Observable(subscriber => {
    //   return onAuthStateChanged(this.auth, user => {
    //     console.log('Auth state changed: ', user);
    //     subscriber.next(user);
    //   });
    // });
    this.user$.subscribe(fuser => {
      if (fuser) {
        const userDocRef = doc(this.firestore, `${fuser.uid}/usuario`);

        this.userSubscription = docData(userDocRef).subscribe(firestoreUser => {
          const user = Usuario.fromFireBaseUser(<FirestoreUserData>firestoreUser);

          this.store.dispatch( authActions.setUser({ user }));
        });

      } else {
        console.log('No hay usuario logueado');
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, correo: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, correo, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, correo);

        // Aquí usamos doc() y setDoc() correctamente con el SDK modular
        const userDocRef = doc(this.firestore, `${user.uid}/usuario`);
        return setDoc(userDocRef, { ...newUser });
      });
  }

  login ( correo:string, password:string ) {
    return signInWithEmailAndPassword(this.auth, correo, password);
  }

  logout ( ) {
    return signOut(this.auth);
  }

  isAuth() {
    return this.user$.pipe(
      map(fuser => fuser != null)
    )
  }
}
