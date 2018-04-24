import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';

import { AppComponent } from './app.component';

//Extras imports / Components Imports
import { MaterialModule } from './module-material/material.module';

//Routes
import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = [
  {path: '', component: AppComponent}
]

@NgModule({
  declarations: [
    AppComponent
  ],
  exports: [
    CdkTableModule
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
