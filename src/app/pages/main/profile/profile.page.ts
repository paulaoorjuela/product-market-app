import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  imageOutline, cameraOutline, personCircleOutline,
  informationCircleOutline} from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { User } from 'src/app/models/user.model';
import { IonContent, IonButton, IonAvatar, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonIcon, IonButton, IonContent, IonAvatar, CommonModule, FormsModule, HeaderComponent],
})
export class ProfilePage implements OnInit {
  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    addIcons({cameraOutline,personCircleOutline,informationCircleOutline,checkmarkCircleOutline,alertCircleOutline,imageOutline,});
  }

  ngOnInit() {}

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  // Take a picture or select from gallery
  async takeImage() {
    let user = this.user();
    let path = `users/${user.id}`;

    const dataUrl = (await this.utilsService.takePicture('Profile picture')).dataUrl;

    const loading = await this.utilsService.loading();
    await loading.present();

    let imagePath = `${user.id}/profile`;
    user.image = await this.firebaseService.uploadImage(imagePath, dataUrl);

    this.firebaseService
      .updateDocument(path, { image: user.image })
      .then(async (res) => {
        this.utilsService.saveInLocalStorage('user', user);
        this.utilsService.presentToast({
          message: 'Image updated successfully',
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
