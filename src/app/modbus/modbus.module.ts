import { ModbusModalPageModule } from './modbus-modal/modbus-modal.module';
import { ModbusModalPage } from './modbus-modal/modbus-modal.page';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModbusPage } from './modbus.page';
import { LoginModule } from '../login/login.module';
import { PipeModule } from '../pipes/pipes.modules';
import { ScrollTableModule } from '../scroll-table/scroll-table.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ModbusModalPageModule,
    RouterModule.forChild([{ path: '', component: ModbusPage }]),
    LoginModule,
    PipeModule,
    ScrollTableModule
  ],
  declarations: [ModbusPage],
  entryComponents: [ModbusModalPage]
})
export class ModbusPageModule {}
