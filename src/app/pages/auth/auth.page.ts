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
  lockClosedOutline,
  logInOutline,
  mailOutline,
  personAddOutline,
  alertCircleOutline,
  personCircleOutline
} from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { LogoComponent } from 'src/app/components/logo/logo.component';
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
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
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private firebaseService: FirebaseService, private utilsService: UtilsService) {
    addIcons({
      lockClosedOutline,
      mailOutline,
      logInOutline,
      personAddOutline,
      alertCircleOutline,
      personCircleOutline
    });
  }

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading()
      await loading.present()
      this.firebaseService.signin(this.form.value as User).then((res) => {
        this.getUserInfo(res.user.uid)
      }).catch(error =>{
        console.log(error);
        this.utilsService.presentToast({
          message: 'Invalid credentials, please check your email and password',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss()
      })
    }
  }

  async getUserInfo(id: string) {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      let path = `users/${id}`;

      this.firebaseService.getDocument(path)
        .then((user: User) => {
          this.utilsService.saveInLocalStorage('user', user)
          this.utilsService.routerLink('/main/home')
          this.form.reset()

          this.utilsService.presentToast({
            message:`Wellcome ${user.name}`,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
          });

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
