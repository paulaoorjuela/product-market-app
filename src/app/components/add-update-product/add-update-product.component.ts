import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline, imageOutline } from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonAvatar,
} from '@ionic/angular/standalone';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    IonContent,
    IonButton,
    IonIcon,
    IonAvatar,
    CustomInputComponent,
  ],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    addIcons({
      checkmarkCircleOutline,
      alertCircleOutline,
      imageOutline,
    });
  }

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  // Take a picture or select from gallery
  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Product image'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }
// -----> CONVERT STRING TO NUMBER <-----
  setNumberInputs(){
    let {soldUnits, price} = this.form.controls
    if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value))
    if(price.value) price.setValue(parseFloat(price.value))
  }

// //////////////////////////// CREATE PRODUCT ////////////////////////////

  async createProduct() {
    let path = `users/${this.user.id}/products`;

    const loading = await this.utilsService.loading();
    await loading.present();

    // -----> UPLOAD IMAGE AND OBTAIN URL <-----
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.id}/${Date.now()}`;
    let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);
    delete this.form.value.id;

    this.firebaseService
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({ success: true });
        this.utilsService.presentToast({
          message: 'Product created successfully',
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

  // //////////////////////////// UPDATE PRODUCT ////////////////////////////
  async updateProduct() {
    let path = `users/${this.user.id}/products/${this.product.id}`;

    const loading = await this.utilsService.loading();
    await loading.present();

    // -----> UPLOAD IMAGE AND OBTAIN URL, IF THE IMAGE HAS CHANGED <-----
    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseService.getFilePath(
        this.product.image
      );
      let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseService
      .updateDocument(path, this.form.value)
      .then(async (res) => {
        this.utilsService.dismissModal({ success: true });
        this.utilsService.presentToast({
          message: 'Product updated successfully',
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
