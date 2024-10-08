import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonIcon,
  IonLabel,
  IonContent,
  IonMenu,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline } from 'ionicons/icons';
import { HeaderComponent } from './components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonLabel,
    IonIcon,
    IonMenu,
    IonMenuToggle,
    IonApp,
    IonRouterOutlet,
    HeaderComponent,
    RouterLink,
  ],
})
export class AppComponent {
constructor(){
  addIcons({
    homeOutline, personOutline
  });
}

  pages = [
    { title: 'Home', url: 'main/home', icon: 'home-outline' },
    { title: 'Profile', url: 'main/profile', icon: 'person-outline' },
  ];
}
