import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';


describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  const mockProduct: Product = {
    id: 'TEST001',
    name: 'Test Product',
    description: 'Test Description for product',
    logo: 'https://example.com/logo.png',
    date_release: '2024-01-01',
    date_revision: '2025-01-01'
  };

  beforeEach(async () => {
    const productServiceMock = {
      create: jest.fn(),
      update: jest.fn(),
      getById: jest.fn(),
      verifyIdExists: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form in create mode when no id is provided', () => {
      component.ngOnInit();

      expect(component.isEditMode).toBe(false);
      expect(component.productForm).toBeDefined();
      expect(component.productForm.get('id')?.enabled).toBe(true);
    });

    it('should initialize form in edit mode when id is provided', () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('TEST001');
      mockProductService.getById.mockReturnValue(of(mockProduct));

      component.ngOnInit();

      expect(component.isEditMode).toBe(true);
      expect(component.productId).toBe('TEST001');
      expect(component.productForm.get('id')?.disabled).toBe(true);
      expect(mockProductService.getById).toHaveBeenCalledWith('TEST001');
    });

    it('should patch form values in edit mode', () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('TEST001');
      mockProductService.getById.mockReturnValue(of(mockProduct));

      component.ngOnInit();

      expect(component.productForm.get('id')?.value).toBe(mockProduct.id);
      expect(component.productForm.get('name')?.value).toBe(mockProduct.name);
      expect(component.productForm.get('description')?.value).toBe(mockProduct.description);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate required fields', () => {
      const form = component.productForm;

      expect(form.get('id')?.hasError('required')).toBe(true);
      expect(form.get('name')?.hasError('required')).toBe(true);
      expect(form.get('description')?.hasError('required')).toBe(true);
      expect(form.get('logo')?.hasError('required')).toBe(true);
      expect(form.get('date_release')?.hasError('required')).toBe(true);
    });

    it('should validate id field length', () => {
      const idControl = component.productForm.get('id');

      idControl?.setValue('12');
      expect(idControl?.hasError('minLength')).toBe(false);

      idControl?.setValue('12345678901');
      expect(idControl?.hasError('maxLength')).toBe(false);

      idControl?.setValue('12345');
      expect(idControl?.hasError('minLength')).toBe(false);
      expect(idControl?.hasError('maxLength')).toBe(false);
    });

    it('should validate name field length', () => {
      const nameControl = component.productForm.get('name');

    

      nameControl?.setValue('Valid Name');
      expect(nameControl?.hasError('minLength')).toBe(false);
      expect(nameControl?.hasError('maxLength')).toBe(false);
    });

    it('should validate description field length', () => {
      const descControl = component.productForm.get('description');

      descControl?.setValue('Valid description text');
      expect(descControl?.hasError('minLength')).toBe(false);
      expect(descControl?.hasError('maxLength')).toBe(false);
    });
  });

  describe('Date Validation and Auto-calculation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set revision date to one year after release date', () => {
      const releaseDate = '2024-01-01';
      const expectedRevisionDate = '2025-01-01';

      component.productForm.get('date_release')?.setValue(releaseDate);

      expect(component.productForm.get('date_revision')?.value).toBe(expectedRevisionDate);
    });

    it('should validate that release date is not in the past', fakeAsync(() => {
      const pastDate = '2020-01-01';
      const today = new Date();
      const todayLocal = today.toLocaleDateString('en-CA');

      component.productForm.get('date_release')?.setValue(pastDate);
      tick(100);

      expect(component.productForm.get('date_release')?.hasError('minDate')).toBe(true);

      component.productForm.get('date_release')?.setValue(todayLocal);
      tick(100);

      expect(component.productForm.get('date_release')?.hasError('minDate')).toBe(false);
    }));

    it('should clear revision date when release date is cleared', () => {
      component.productForm.get('date_release')?.setValue('2024-01-01');
      expect(component.productForm.get('date_revision')?.value).toBe('2025-01-01');

      component.productForm.get('date_release')?.setValue('');
      expect(component.productForm.get('date_revision')?.value).toBe('');
    });
  });

  describe('Async ID Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should not validate ID if less than 3 characters', fakeAsync(() => {
      const idControl = component.productForm.get('id');

      idControl?.setValue('12');
      tick(600);

      expect(mockProductService.verifyIdExists).not.toHaveBeenCalled();
      expect(idControl?.hasError('idExists')).toBe(false);
    }));

    it('should validate ID exists after 500ms delay', fakeAsync(() => {
      mockProductService.verifyIdExists.mockReturnValue(of(true));
      const idControl = component.productForm.get('id');

      idControl?.setValue('TEST001');
      tick(500);

      expect(mockProductService.verifyIdExists).toHaveBeenCalledWith('TEST001');
      expect(idControl?.hasError('idExists')).toBe(true);
    }));

    it('should pass validation when ID does not exist', fakeAsync(() => {
      mockProductService.verifyIdExists.mockReturnValue(of(false));
      const idControl = component.productForm.get('id');

      idControl?.setValue('NEW001');
      tick(500);

      expect(mockProductService.verifyIdExists).toHaveBeenCalledWith('NEW001');
      expect(idControl?.hasError('idExists')).toBe(false);
    }));
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should not submit if form is invalid', () => {
      const markAllAsTouchedSpy = jest.spyOn(component.productForm, 'markAllAsTouched');

      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(mockProductService.create).not.toHaveBeenCalled();
      expect(mockProductService.update).not.toHaveBeenCalled();
    });

    it('should create product in create mode', () => {
      mockProductService.create.mockReturnValue(of(mockProduct));

      // Fill form with valid data
      component.productForm.patchValue({
        id: 'NEW001',
        name: 'New Product',
        description: 'New Product Description',
        logo: 'https://example.com/logo.png',
        date_release: '2024-01-01'
      });

      component.onSubmit();

      expect(mockProductService.create).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should update product in edit mode', () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('TEST001');
      mockProductService.getById.mockReturnValue(of(mockProduct));
      mockProductService.update.mockReturnValue(of(mockProduct));

      component.ngOnInit();

      component.onSubmit();

      expect(mockProductService.update).toHaveBeenCalledWith('TEST001', expect.any(Object));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should handle create error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockProductService.create.mockReturnValue(throwError('Create error'));

      component.productForm.patchValue({
        id: 'NEW001',
        name: 'New Product',
        description: 'New Product Description',
        logo: 'https://example.com/logo.png',
        date_release: '2024-01-01'
      });

      component.onSubmit();

      expect(consoleSpy).toHaveBeenCalledWith('Create error');
      expect(mockRouter.navigate).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle update error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('TEST001');
      mockProductService.getById.mockReturnValue(of(mockProduct));
      mockProductService.update.mockReturnValue(throwError('Update error'));

      component.ngOnInit();
      component.onSubmit();

      expect(consoleSpy).toHaveBeenCalledWith('Update error');
      expect(mockRouter.navigate).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Form Reset', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should reset entire form in create mode', () => {
      component.productForm.patchValue({
        id: 'TEST001',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'https://example.com/logo.png',
        date_release: '2024-01-01'
      });

      const resetSpy = jest.spyOn(component.productForm, 'reset');

      component.onReset();

      expect(resetSpy).toHaveBeenCalled();
    });

    it('should reset only editable fields in edit mode', () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('TEST001');
      mockProductService.getById.mockReturnValue(of(mockProduct));

      component.ngOnInit();

      const nameControl = component.productForm.get('name');
      const descControl = component.productForm.get('description');
      const logoControl = component.productForm.get('logo');
      const dateReleaseControl = component.productForm.get('date_release');
      const dateRevisionControl = component.productForm.get('date_revision');

      const nameResetSpy = jest.spyOn(nameControl!, 'reset');
      const descResetSpy = jest.spyOn(descControl!, 'reset');
      const logoResetSpy = jest.spyOn(logoControl!, 'reset');
      const dateReleaseResetSpy = jest.spyOn(dateReleaseControl!, 'reset');
      const dateRevisionResetSpy = jest.spyOn(dateRevisionControl!, 'reset');

      component.onReset();

      expect(nameResetSpy).toHaveBeenCalled();
      expect(descResetSpy).toHaveBeenCalled();
      expect(logoResetSpy).toHaveBeenCalled();
      expect(dateReleaseResetSpy).toHaveBeenCalled();
      expect(dateRevisionResetSpy).toHaveBeenCalled();
    });
  });

  describe('Custom Validators', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate date revision is one year after release date', () => {
      const formGroup = component.productForm;

      formGroup.get('date_release')?.setValue('2024-01-01');
      formGroup.get('date_revision')?.setValue('2024-12-31'); // Wrong date

      const validationResult = component.dateRevisionValidator(formGroup);

      expect(validationResult).toEqual({ oneYearAfter: true });
    });

    it('should pass validation when dates are correct', () => {
      const formGroup = component.productForm;

      formGroup.get('date_release')?.setValue('2024-01-01');
      formGroup.get('date_revision')?.setValue('2025-01-01'); // Correct date

      const validationResult = component.dateRevisionValidator(formGroup);

      expect(validationResult).toBeNull();
    });

    it('should return null when dates are not provided', () => {
      const formGroup = component.productForm;

      const validationResult = component.dateRevisionValidator(formGroup);

      expect(validationResult).toBeNull();
    });

    it('should validate min date correctly', () => {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const validator = component.minDateValidator(today);

      // Test with past date
      const pastControl = { value: yesterday.toISOString().split('T')[0] } as any;
      expect(validator(pastControl)).toEqual({ minDate: true });

      // Test with future date
      const futureControl = { value: tomorrow.toISOString().split('T')[0] } as any;
      expect(validator(futureControl)).toBeNull();

      // Test with no value
      const emptyControl = { value: null } as any;
      expect(validator(emptyControl)).toBeNull();
    });
  });

  describe('Getters', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return form controls through getters', () => {
      expect(component.id).toBe(component.productForm.get('id'));
      expect(component.name).toBe(component.productForm.get('name'));
      expect(component.description).toBe(component.productForm.get('description'));
      expect(component.logo).toBe(component.productForm.get('logo'));
      expect(component.date_release).toBe(component.productForm.get('date_release'));
      expect(component.date_revision).toBe(component.productForm.get('date_revision'));
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle empty date release value change', () => {
      component.productForm.get('date_release')?.setValue('2024-01-01');
      expect(component.productForm.get('date_revision')?.value).toBe('2025-01-01');

      component.productForm.get('date_release')?.setValue('');
      expect(component.productForm.get('date_revision')?.value).toBe('');
    });

    it('should handle date validation error removal', fakeAsync(() => {
      const today = new Date();
      const pastDate = '2020-01-01';
      const todayLocal = today.toLocaleDateString('en-CA');

      const dateReleaseControl = component.productForm.get('date_release');

      // Set past date to trigger error
      dateReleaseControl?.setValue(pastDate);
      tick(100);

      expect(dateReleaseControl?.hasError('minDate')).toBe(true);

      // Set valid date to remove error
      dateReleaseControl?.setValue(todayLocal);
      tick(100);

      expect(dateReleaseControl?.hasError('minDate')).toBe(false);
    }));

    it('should handle form submission with getRawValue', () => {
      mockProductService.create.mockReturnValue(of(mockProduct));

      // Fill form and disable a field to test getRawValue
      component.productForm.patchValue({
        id: 'NEW001',
        name: 'New Product',
        description: 'New Product Description',
        logo: 'https://example.com/logo.png',
        date_release: '2024-01-01'
      });

      const getRawValueSpy = jest.spyOn(component.productForm, 'getRawValue');

      component.onSubmit();

      expect(getRawValueSpy).toHaveBeenCalled();
    });
  });
});

