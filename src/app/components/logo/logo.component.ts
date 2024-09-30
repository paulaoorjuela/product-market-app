import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { shieldHalfOutline } from 'ionicons/icons';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonText]
})
export class LogoComponent  implements OnInit {

  constructor() { addIcons({ shieldHalfOutline }); }

  ngOnInit() {}

}
