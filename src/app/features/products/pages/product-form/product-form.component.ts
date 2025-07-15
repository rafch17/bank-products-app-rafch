import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  standalone: false
})
export class ProductFormComponent {
  productId?: string;
  isEditMode = false;

  // productForm = this.fb.group({
  //   name: [''],
  //   description: [''],
  //   // otros campos...
  // });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.productId;

    // if (this.isEditMode && this.productId) {
    //   this.productService.getProductById(this.productId).subscribe(product => {
    //     this.productForm.patchValue(product);
    //   });
    // }
  }

  onSubmit() {
    // if (this.isEditMode) {
    //   this.productService.update(this.productId!, this.productForm.value).subscribe(() => {
    //     this.router.navigate(['/']);
    //   });
    // } else {
    //   this.productService.createProduct(this.productForm.value).subscribe(() => {
    //     this.router.navigate(['/']);
    //   });
    // }
  }
}
