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
  collectionData,
  query,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';
import { Storage } from '@angular/fire/storage';
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  storage = inject(Storage);
  utilsService = inject(UtilsService);

  // //////////////// -----> AUTHENTICATION <----- ////////////////
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

  // //////////////// -----> DATABASE <----- ////////////////
  setDocument(path: string, data: any) {
    return setDoc(doc(this.firestore, path), data);
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(this.firestore, path), data);
  }

  deleteDocument(path: string) {
    return deleteDoc(doc(this.firestore, path));
  }

  async getDocument(path: string) {
    return (await getDoc(doc(this.firestore, path))).data();
  }

  addDocument(path: string, data: any) {
    return addDoc(collection(this.firestore, path), data);
  }

  getCollectioData(path: string, collectioQuery?: any) {
    const ref = collection(this.firestore, path);
    return collectionData(query(ref, collectioQuery), { idField: 'id' });
  }

  // //////////////// -----> STORAGE <----- ////////////////

  // async uploadImage(path: string, data_url: string) {
  //   const storageReference = storageRef(this.storage, path);
  //   return uploadString(storageReference, data_url, 'data_url').then(() => {
  //     return getDownloadURL(storageReference);
  //   });
  // }

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  // // --- Obtain the image path and its url ---
  // getFilePath(url: string) {
  //   const storageReference = storageRef(this.storage, url);
  //   return storageReference.fullPath;
  // }

  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
