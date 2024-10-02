import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions, ModalController, ModalOptions } from '@ionic/angular/standalone'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController)
  toastController = inject(ToastController)
  modalController = inject(ModalController)
  router = inject(Router)

  loading(){
    return this.loadingController.create({spinner: 'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  routerLink(url: string){
    return this.router.navigateByUrl(url)
  }

  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }

  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key))
  }

  // -----> modal <-----
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data? : any){
    return this.modalController.dismiss(data)
  }
}
