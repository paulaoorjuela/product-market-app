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
import { mailOutline, alertCircleOutline, arrowForward } from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { LogoComponent } from 'src/app/components/logo/logo.component';
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { IonIcon, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
  ],
})
export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    addIcons({
      arrowForward,
      mailOutline,
      alertCircleOutline,
    });
  }

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      this.firebaseService
        .sendRecoveryEmail(this.form.value.email)
        .then((res) => {
          this.utilsService.presentToast({
            message: 'Send! please check your email inbox',
            duration: 1500,
            color: 'primary',
            position: 'middle',
            icon: 'mail-outline',
          });
          this.utilsService.routerLink('/auth');
          this.form.reset();
        })
        .catch((error) => {
          console.log(error);
          this.utilsService.presentToast({
            message:
              'No user found with this email',
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
