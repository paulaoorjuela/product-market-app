import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonContent,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  IonItem,
  IonFooter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, logOutOutline, personOutline, personCircleOutline } from 'ionicons/icons';
import { HeaderComponent } from './components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { FirebaseService } from './services/firebase.service';
import { UtilsService } from './services/utils.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonItem,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonMenu,
    IonMenuToggle,
    IonApp,
    IonRouterOutlet,
    HeaderComponent,
    RouterLink,
    NgClass,
  ],
})
export class AppComponent {
  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    addIcons({personCircleOutline,logOutOutline,homeOutline,personOutline,});
  }

  pages = [
    { title: 'Home', url: 'main/home', icon: 'home-outline' },
    { title: 'Profile', url: 'main/profile', icon: 'person-outline' },
  ];
  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  signOut(){
    this.firebaseService.signOut()
  }
}
