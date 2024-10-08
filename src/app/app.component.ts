import { Component, Inject } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonIcon,
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
import { homeOutline, logOutOutline, personOutline } from 'ionicons/icons';
import { HeaderComponent } from './components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { FirebaseService } from './services/firebase.service';
import { UtilsService } from './services/utils.service';

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
    addIcons({
      homeOutline,
      personOutline,
      logOutOutline,
    });
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

  signOut(){
    this.firebaseService.signOut()
  }
}
