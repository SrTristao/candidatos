import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';

//Extras imports / Components Imports
import { MaterialModule } from './module-material/material.module';
import { HTTPInterceptor } from './services/http.interceptor';
import { ServicesModule } from './services/services.module';

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
    MaterialModule,
    ServicesModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HTTPInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
