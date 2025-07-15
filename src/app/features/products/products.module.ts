import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './products-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { PichinchaButtonComponent } from '../../shared/components/pichincha-button/pichincha-button.component';
import { PichinchaModalComponent } from '../../shared/components/pichincha-modal/pichincha-modal.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    FormsModule,
    PichinchaButtonComponent,
    PichinchaModalComponent
  ]
})

export class ProductsModule { }
