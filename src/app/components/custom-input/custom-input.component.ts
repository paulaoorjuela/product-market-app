import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from "ionicons";
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class CustomInputComponent  implements OnInit {
  @Input() control!: FormControl
  @Input() type!: string
  @Input() label!: string
  @Input() autocomplete!: string
  @Input() icon!: string

  isPassword!: boolean
  hide: boolean = true

  constructor() { addIcons({ eyeOutline,  eyeOffOutline}); }

  ngOnInit() {
    if (this.type == 'password') {
      this.isPassword = true;
    }
  }

  togglePasswordVisibility() {
    this.hide =!this.hide;
    if(this.hide) this.type = 'password'
    else this.type = 'text'
  }

}
