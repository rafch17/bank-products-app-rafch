import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { Observable, of, timer, switchMap, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  standalone: false
})
export class ProductFormComponent {
  isEditMode = false;
  productId!: string;
  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;

    this.productForm = this.fb.group({
      id: ['',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [this.idExistsValidator()]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    }, { validators: this.dateRevisionValidator });

    if (this.isEditMode) {
      this.productId = id!;
      this.productForm.get('id')?.disable();

      this.productService.getById(this.productId).subscribe(product => {
        this.productForm.patchValue(product);
      });
    }

    this.productForm.get('date_release')?.valueChanges.subscribe((value: string) => {
      if (!value) return;

      const today = new Date();
      const todayLocal = today.toLocaleDateString('en-CA');

      if (value < todayLocal) {
        this.productForm.get('date_release')?.setErrors({
          ...this.productForm.get('date_release')?.errors,
          minDate: true,
        });
      } else {
        const errors = this.productForm.get('date_release')?.errors;
        if (errors && errors['minDate']) {
          delete errors['minDate'];
          this.productForm.get('date_release')?.setErrors(
            Object.keys(errors).length === 0 ? null : errors
          );
        }
      }
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value) {
        const releaseDate = new Date(value);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(revisionDate.getFullYear() + 1);

        const formattedRevisionDate = revisionDate.toISOString().split('T')[0];

        this.productForm.get('date_revision')?.setValue(formattedRevisionDate);
      } else {
        this.productForm.get('date_revision')?.setValue('');
      }
    });
  }


  get id() { return this.productForm.get('id')!; }
  get name() { return this.productForm.get('name')!; }
  get description() { return this.productForm.get('description')!; }
  get logo() { return this.productForm.get('logo')!; }
  get date_release() { return this.productForm.get('date_release')!; }
  get date_revision() { return this.productForm.get('date_revision')!; }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = this.productForm.getRawValue();

    if (this.isEditMode) {
      this.productService.update(this.productId, product).subscribe({
        next: () => {
          console.log('Producto actualizado');
          this.router.navigate(['/products']);
        },
        error: (err) => console.error(err)
      });
    } else {
      this.productService.create(product).subscribe({
        next: () => {
          console.log('Producto creado');
          this.router.navigate(['/products']);
        },
        error: (err) => console.error(err)
      });
    }
  }


  onReset() {
    if (this.isEditMode) {
      this.productForm.get('name')?.reset()
      this.productForm.get('description')?.reset()
      this.productForm.get('logo')?.reset()
      this.productForm.get('date_release')?.reset()
      this.productForm.get('date_revision')?.reset()
    } else {
      this.productForm.reset();
    }
  }

  idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.length < 3) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.productService.verifyIdExists(control.value)),
        map(exists => (exists ? { idExists: true } : null))
      );
    };
  }

  minDateValidator(minDate: Date) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      if (selectedDate < new Date(minDate.toDateString())) {
        return { minDate: true };
      }
      return null;
    };
  }

  dateRevisionValidator(group: AbstractControl): ValidationErrors | null {
    const dateRelease = group.get('date_release')?.value;
    const dateRevision = group.get('date_revision')?.value;

    if (!dateRelease || !dateRevision) return null;

    const releaseDate = new Date(dateRelease);
    const revisionDate = new Date(dateRevision);

    const expectedRevisionDate = new Date(releaseDate);
    expectedRevisionDate.setFullYear(expectedRevisionDate.getFullYear() + 1);

    if (revisionDate.toDateString() !== expectedRevisionDate.toDateString()) {
      return { oneYearAfter: true };
    }
    return null;
  }


}
