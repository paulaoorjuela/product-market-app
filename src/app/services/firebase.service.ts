import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import {
  Firestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import {
  Storage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
} from '@angular/fire/storage'; // Use the new Storage API

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private utilsService: UtilsService,
    private storage: Storage // Use the new Storage service
  ) {}

  // -----> AUTHENTICATION <-----
  getAuth() {
    return this.auth;
  }
  signin(user: User) {
    return signInWithEmailAndPassword(this.auth, user.email, user.password);
  }

  signup(user: User) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(this.auth.currentUser, { displayName });
  }

  async sendRecoveryEmail(email: string) {
    const userDocRef = doc(this.firestore, `users/${email}`);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      throw new Error('No user found with this email');
    }
    return sendPasswordResetEmail(this.auth, email);
  }

  signOut() {
    this.auth.signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/auth');
  }

  // -----> DATABASE <-----
  setDocument(path: string, data: any) {
    return setDoc(doc(this.firestore, path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(this.firestore, path))).data();
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(this.firestore, path), data);
  }

  // -----> STORAGE <-----
  async uploadImage(path: string, data_url: string) {
    const storageReference = storageRef(this.storage, path);
    return uploadString(storageReference, data_url, 'data_url').then(() => {
      return getDownloadURL(storageReference);
    });
  }
}
