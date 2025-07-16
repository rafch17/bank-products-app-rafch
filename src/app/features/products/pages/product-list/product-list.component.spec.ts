import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01'
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: '2023-02-01',
      date_revision: '2024-02-01'
    },
    {
      id: '3',
      name: 'Another Product',
      description: 'Description 3',
      logo: 'logo3.png',
      date_release: '2023-03-01',
      date_revision: '2024-03-01'
    }
  ];

  beforeEach(async () => {
    const productServiceMock = {
      getAll: jest.fn(),
      delete: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isLoading).toBe(true);
      expect(component.products).toEqual([]);
      expect(component.filteredProducts).toEqual([]);
      expect(component.displayedProducts).toEqual([]);
      expect(component.openedMenuIndex).toBe(-1);
      expect(component.searchQuery).toBe('');
      expect(component.selectedProductName).toBe('');
      expect(component.selectedProductId).toBe('');
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(5);
      expect(component.showDeleteModal).toBe(false);
    });

    it('should call loadProducts on ngOnInit', () => {
      const loadProductsSpy = jest.spyOn(component, 'loadProducts').mockImplementation();
      component.ngOnInit();
      expect(loadProductsSpy).toHaveBeenCalled();
    });
  });

  describe('loadProducts', () => {
    it('should load products successfully', (done) => {
      mockProductService.getAll.mockReturnValue(of(mockProducts));
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.loadProducts();

      expect(component.isLoading).toBe(true);

      setTimeout(() => {
        expect(mockProductService.getAll).toHaveBeenCalled();
        expect(component.products).toEqual(mockProducts);
        expect(component.filteredProducts).toEqual(mockProducts);
        expect(updateDisplayedProductsSpy).toHaveBeenCalled();
        expect(component.isLoading).toBe(false);
        done();
      }, 1600);
    });

    it('should handle loading state correctly', () => {
      mockProductService.getAll.mockReturnValue(of(mockProducts));

      component.loadProducts();
      expect(component.isLoading).toBe(true);

      setTimeout(() => {
        expect(component.isLoading).toBe(false);
      }, 1600);
    });
  });

  describe('Search functionality', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.filteredProducts = mockProducts;
    });

    it('should filter products by name', () => {
      component.searchQuery = 'Product 1';
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.onSearch();

      expect(component.filteredProducts).toEqual([mockProducts[0]]);
      expect(component.currentPage).toBe(1);
      expect(updateDisplayedProductsSpy).toHaveBeenCalled();
    });

    it('should filter products case-insensitively', () => {
      component.searchQuery = 'product';
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.onSearch();

      expect(component.filteredProducts.length).toBe(3);
      expect(component.filteredProducts).toContain(mockProducts[0]);
      expect(component.filteredProducts).toContain(mockProducts[1]);
    });

    it('should return empty array when no products match', () => {
      component.searchQuery = 'NonExistent';
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.onSearch();

      expect(component.filteredProducts).toEqual([]);
      expect(component.currentPage).toBe(1);
      expect(updateDisplayedProductsSpy).toHaveBeenCalled();
    });

    it('should reset to page 1 when searching', () => {
      component.currentPage = 3;
      component.searchQuery = 'Product';
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.onSearch();

      expect(component.currentPage).toBe(1);
      expect(updateDisplayedProductsSpy).toHaveBeenCalled();
    });
  });

  describe('Pagination functionality', () => {
    beforeEach(() => {
      component.filteredProducts = mockProducts;
    });

    it('should update displayed products correctly', () => {
      component.currentPage = 1;
      component.pageSize = 2;

      component.updateDisplayedProducts();

      expect(component.displayedProducts).toEqual([mockProducts[0], mockProducts[1]]);
    });

    it('should update displayed products for second page', () => {
      component.currentPage = 2;
      component.pageSize = 2;

      component.updateDisplayedProducts();

      expect(component.displayedProducts).toEqual([mockProducts[2]]);
    });

    it('should change page size and reset to page 1', () => {
      component.currentPage = 2;
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.changePageSize(10);

      expect(component.pageSize).toBe(10);
      expect(component.currentPage).toBe(1);
      expect(updateDisplayedProductsSpy).toHaveBeenCalled();
    });

    it('should handle page size change from select event', () => {
      const mockEvent = {
        target: { value: '10' }
      } as any;
      const changePageSizeSpy = jest.spyOn(component, 'changePageSize').mockImplementation();

      component.onSelectChange(mockEvent);

      expect(changePageSizeSpy).toHaveBeenCalledWith(10);
    });

    it('should go to specific page', () => {
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.goToPage(2);

      expect(component.currentPage).toBe(2);
      expect(updateDisplayedProductsSpy).toHaveBeenCalled();
    });

    it('should calculate total pages correctly', () => {
      component.filteredProducts = mockProducts;
      component.pageSize = 2;

      expect(component.totalPages).toBe(2);
    });

    it('should handle empty filtered products for total pages', () => {
      component.filteredProducts = [];
      component.pageSize = 5;

      expect(component.totalPages).toBe(0);
    });
  });

  describe('Actions menu', () => {
    it('should toggle actions menu', () => {
      component.openedMenuIndex = -1;

      component.toggleActionsMenu(0);
      expect(component.openedMenuIndex).toBe(0);

      component.toggleActionsMenu(0);
      expect(component.openedMenuIndex).toBe(-1);
    });

    it('should close previous menu when opening new one', () => {
      component.openedMenuIndex = 0;

      component.toggleActionsMenu(1);
      expect(component.openedMenuIndex).toBe(1);
    });

    it('should close menu on document click outside actions-cell', () => {
      component.openedMenuIndex = 0;
      const mockEvent = {
        target: document.createElement('div')
      } as any;

      component.onDocumentClick(mockEvent);

      expect(component.openedMenuIndex).toBe(-1);
    });

    it('should not close menu on document click inside actions-cell', () => {
      component.openedMenuIndex = 0;
      const mockTarget = document.createElement('div');
      mockTarget.className = 'actions-cell';
      const mockEvent = {
        target: mockTarget
      } as any;

      jest.spyOn(mockTarget, 'closest').mockReturnValue(mockTarget);

      component.onDocumentClick(mockEvent);

      expect(component.openedMenuIndex).toBe(0);
    });
  });

  describe('Edit functionality', () => {
    it('should navigate to edit form', () => {
      const productId = '123';

      component.onEdit(productId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/products/form', productId]);
      expect(component.openedMenuIndex).toBe(null);
    });
  });

  describe('Delete functionality', () => {
    it('should delete product with confirmation', () => {
      const productId = '123';
      mockProductService.delete.mockReturnValue(of({}));
      const loadProductsSpy = jest.spyOn(component, 'loadProducts').mockImplementation();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      component.onDelete(productId);

      expect(confirmSpy).toHaveBeenCalledWith('¿Seguro que quieres eliminar este producto?');
      expect(mockProductService.delete).toHaveBeenCalledWith(productId);
      expect(loadProductsSpy).toHaveBeenCalled();
      expect(component.openedMenuIndex).toBe(null);
    });

    it('should not delete product when confirmation is cancelled', () => {
      const productId = '123';
      const loadProductsSpy = jest.spyOn(component, 'loadProducts').mockImplementation();
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      component.onDelete(productId);

      expect(confirmSpy).toHaveBeenCalled();
      expect(mockProductService.delete).not.toHaveBeenCalled();
      expect(loadProductsSpy).not.toHaveBeenCalled();
      expect(component.openedMenuIndex).toBe(null);
    });

    it('should set delete modal data', () => {
      const product = mockProducts[0];

      component.deleteProduct(product);

      expect(component.showDeleteModal).toBe(true);
      expect(component.selectedProductName).toBe(product.name);
      expect(component.selectedProductId).toBe(product.id);
    });

    it('should confirm delete product successfully', () => {
      const productId = '123';
      mockProductService.delete.mockReturnValue(of({}));
      const loadProductsSpy = jest.spyOn(component, 'loadProducts').mockImplementation();

      component.confirmDeleteProduct(productId);

      expect(mockProductService.delete).toHaveBeenCalledWith(productId);
      expect(loadProductsSpy).toHaveBeenCalled();
      expect(component.showDeleteModal).toBe(false);
      expect(component.openedMenuIndex).toBe(null);
    });

    it('should handle delete error', () => {
      const productId = '123';
      const error = new Error('Delete failed');
      mockProductService.delete.mockReturnValue(throwError(() => error));
      const loadProductsSpy = jest.spyOn(component, 'loadProducts').mockImplementation();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      component.confirmDeleteProduct(productId);

      expect(mockProductService.delete).toHaveBeenCalledWith(productId);
      expect(loadProductsSpy).not.toHaveBeenCalled();
      expect(component.showDeleteModal).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(alertSpy).toHaveBeenCalledWith('Error al eliminar producto');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty products array', () => {
      component.products = [];
      component.filteredProducts = [];

      component.updateDisplayedProducts();

      expect(component.displayedProducts).toEqual([]);
    });

    it('should handle search with empty string', () => {
      component.products = mockProducts;
      component.searchQuery = '';
      const updateDisplayedProductsSpy = jest.spyOn(component, 'updateDisplayedProducts').mockImplementation();

      component.onSearch();

      expect(component.filteredProducts).toEqual(mockProducts);
      expect(updateDisplayedProductsSpy).toHaveBeenCalled();
    });

    it('should handle pagination with single item', () => {
      component.filteredProducts = [mockProducts[0]];
      component.pageSize = 5;

      component.updateDisplayedProducts();

      expect(component.displayedProducts).toEqual([mockProducts[0]]);
    });
  });
});