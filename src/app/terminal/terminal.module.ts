import { TerminalModalPageModule } from './terminal-modal/terminal-modal.module';
import { TerminalModalPage } from './terminal-modal/terminal-modal.page';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerminalPage } from './terminal.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TerminalModalPageModule,
    RouterModule.forChild([{ path: '', component: TerminalPage }])
  ],
  declarations: [TerminalPage],
  entryComponents: [TerminalModalPage]
})
export class TerminalPageModule {}
