import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonItem, IonIcon, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonItem, IonContent, CommonModule]
})
export class MainPage implements OnInit {

  constructor(){}

  ngOnInit() {
  }

}
