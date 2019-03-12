import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // { path: 'modbusModal', loadChildren: './modbus/modbus-modal/modbus-modal.module#ModbusModalPageModule' },
  // { path: 'tabs/home', loadChildren: './home/home.module#HomePageModule'},
  // { path: 'tabs/modbus', loadChildren: './modbus/modbus.module#ModbusPageModule'},
  // { path: 'tabs/settings', loadChildren: './settings/settings.module#SettingsPageModule'}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
