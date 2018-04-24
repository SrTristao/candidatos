import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule,
         MatCheckboxModule,
         MatTableModule,
         MatFormFieldModule,
         MatInputModule,
         MatToolbarModule,
         MatMenuModule,
         MatIconModule, 
         MatDialogModule,
         MatSelectModule,
         MatTooltipModule,
         MatGridListModule,
         MatProgressBarModule,
         MatProgressSpinnerModule,
         MatAutocompleteModule
        } from '@angular/material';

  const injectableComponents = [
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatGridListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ]
  
@NgModule({
  imports: [
    CommonModule,
    injectableComponents
  ],
  providers: [MatDialogModule],
  exports: injectableComponents,
  declarations: []
})
export class MaterialModule { }