import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const utilsService = inject(UtilsService);

  let user = localStorage.getItem('user');

  return new Promise((resolve) => {
    firebaseService.getAut().onAuthStateChanged((auth) => {
      if (auth && user) {
        resolve(true);
      } else {
        utilsService.routerLink('/auth');
        resolve(false);
      }
    });
  });
};
