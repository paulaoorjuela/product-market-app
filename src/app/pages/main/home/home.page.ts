import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AddUpdateProductComponent } from 'src/app/components/add-update-product/add-update-product.component';
import { User } from 'src/app/models/user.model';
import { Product } from 'src/app/models/product.model';

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
    private utilsService: UtilsService
  ) {
    addIcons({ add, createOutline, trashOutline });
  }

  products: Product[] = [];
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

  getProducts() {
    let path = `users/${this.user().id}/products`;
    let sub = this.firebaseService.getCollectioData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      },
    });
  }

  // add or update product
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsService.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product },
    });
    if (success) this.getProducts();
  }
}
