import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';
import { PipeModule } from '../pipes/pipes.modules';
import { LoginModule } from '../login/login.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    PipeModule,
    LoginModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
