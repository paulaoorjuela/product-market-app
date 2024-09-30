import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { LogoComponent } from 'src/app/components/logo/logo.component';
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
  ],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    id: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    addIcons({
      personOutline,
      lockClosedOutline,
      mailOutline,
      personAddOutline,
      alertCircleOutline,
    });
  }

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsService.loading();
      await loading.present();

      this.firebaseService
        .signup(this.form.value as User)
        .then(async (res) => {
          await this.firebaseService.updateUser(this.form.value.name);
          let id = res.user.uid
          this.form.controls.id.setValue(id)
          this.setUserInfo(id)
          // console.log(res);
        })
        .catch((error) => {
          console.log(error);
          this.utilsService.presentToast({
            message:
              'Invalid credentials, please check your email and password',
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

  async setUserInfo(id: string) {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      let path = `users/${id}`;
      delete this.form.value.password

      this.firebaseService.setDocument(path, this.form.value)
        .then(async (res) => {
          this.utilsService.saveInLocalStorage('user', this.form.value)
          this.utilsService.routerLink('/main/home')
          this.form.reset()
        })
        .catch((error) => {
          console.log(error);
          this.utilsService.presentToast({
            message:
              'Invalid credentials, please check your email and password',
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
}
