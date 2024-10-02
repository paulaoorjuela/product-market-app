import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { add } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AddUpdateProductComponent } from 'src/app/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonFabButton,
    IonFab,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
    AddUpdateProductComponent
  ],
})
export class HomePage implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    addIcons({
      add,
    });
  }

  signOut() {
    this.firebaseService.signOut();
  }

  // add or update product
  addUpdateProduct() {
    this.utilsService.presentModal({
      component: AddUpdateProductComponent,
      cssClass:'add-update-modal',
    })
  }
}
