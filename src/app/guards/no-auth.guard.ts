import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService);
  const utilsService = inject(UtilsService);

  return new Promise((resolve) => {
    firebaseService.getAut().onAuthStateChanged((auth) => {
      if (!auth) resolve(true);
      else {
        utilsService.routerLink('/main/home');
        resolve(false);
      }
    });
  });
};
