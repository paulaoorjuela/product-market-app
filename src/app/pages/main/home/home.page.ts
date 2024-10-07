import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from '../../../components/header/header.component';
import {
  add,
  createOutline,
  shieldOutline,
  trashOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AddUpdateProductComponent } from 'src/app/components/add-update-product/add-update-product.component';
import { User } from 'src/app/models/user.model';
import { Product } from 'src/app/models/product.model';
import { Firestore } from '@angular/fire/firestore';
import { orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    AddUpdateProductComponent,
  ],
})
export class HomePage implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private firestore: Firestore
  ) {
    addIcons({ add, createOutline, trashOutline, shieldOutline });
  }

  products: Product[] = [];
  loading: boolean = false;
  ngOnInit() {
    addIcons({
      add,
    });
  }

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    this.getProducts();
  }
  // ///////// REFRESHER //////////
  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  // ///////// OBTAIN TOTAL PROFITS //////////
  getProfits() {
    return this.products.reduce((index, product) => index + product.price * product.soldUnits, 0)
  }

  // //////////////////////////// GET PRODUCT ////////////////////////////
  getProducts() {
    let path = `users/${this.user().id}/products`;
    this.loading = true;

    const query = [
      orderBy('soldUnits', 'desc'),
      // where('soldUnits', '>', 3)
    ];

    let sub = this.firebaseService.getCollectioData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        this.loading = false;
        sub.unsubscribe();
      },
    });
  }

  // //////////////////////////// ADD OR UPDATE PRODUCT ////////////////////////////
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsService.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });
    if (success) this.getProducts();
  }

  // //////////////////////////// CONFIRMATION BEFORE DELETE PRODUCT ////////////////////////////
  async confirmDeleteProduct(product: Product) {
    this.utilsService.presentAlert({
      header: 'Delete Product',
      message: 'Are you sure you want to delete this product?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes, delete',
          handler: () => {
            this.deleteProduct(product);
          },
        },
      ],
    });
  }

  // //////////////////////////// DELETE PRODUCT ////////////////////////////
  async deleteProduct(product: Product) {
    let path = `users/${this.user().id}/products/${product.id}`;

    const loading = await this.utilsService.loading();
    await loading.present();

    let imagePath = await this.firebaseService.getFilePath(product.image);
    await this.firebaseService.deleteFile(imagePath);

    this.firebaseService
      .deleteDocument(path)
      .then(async (res) => {
        this.products = this.products.filter((p) => p.id !== product.id);

        this.utilsService.presentToast({
          message: 'Product deleted successfully',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsService.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
