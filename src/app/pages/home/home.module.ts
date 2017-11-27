import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbSidebarModule, NbLayoutModule, NbSidebarService } from '@nebular/theme';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    NbLayoutModule,
    NbSidebarModule,
    CommonModule
  ],
  declarations: [HomeComponent],
  providers: [NbSidebarService]
})
export class HomeModule { }
