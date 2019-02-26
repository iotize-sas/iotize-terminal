import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    exports: [
        LoginComponent
    ]
  })
  export class LoginModule {}
