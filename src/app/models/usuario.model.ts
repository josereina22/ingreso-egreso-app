import {FirestoreUserData} from './firestore-user-data.interface';

export class Usuario {

  static fromFireBaseUser({ email, uid, nombre }: FirestoreUserData) {
    return new Usuario(uid, nombre, email);
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string,
  ) {}
}
