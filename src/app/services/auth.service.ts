import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { authState } from 'rxfire/auth'; // 👈 Aquí está la magia
import {map, Observable} from 'rxjs';
import {Usuario} from '../models/usuario.model';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;

  constructor(
    private readonly auth: Auth,
    private firestore: Firestore
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
        console.log(fuser);
        console.log(fuser.uid);
        console.log(fuser.email);
      } else {
        console.log('No hay usuario activo');
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
