import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModbusModalPage } from './modbus-modal.page';
import { PipeModule } from '../../pipes/pipes.modules';

const routes: Routes = [
  {
    path: '',
    component: ModbusModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipeModule
  ],
  declarations: [ModbusModalPage]
})
export class ModbusModalPageModule {}
