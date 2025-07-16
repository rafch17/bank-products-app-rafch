import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiBaseUrl;

  const mockProduct: Product = {
    id: '1',
    name: 'Cuenta Ahorros',
    description: 'Cuenta de ahorro básica',
    logo: 'logo1.png',
    date_release: '2025-01-01',
    date_revision: '2025-07-01',
  };

  const mockProducts: Product[] = [
    mockProduct,
    {
      id: '2',
      name: 'Tarjeta de Crédito',
      description: 'Tarjeta con beneficios',
      logo: 'logo2.png',
      date_release: '2025-02-01',
      date_revision: '2025-08-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    service.getAll().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should get product by ID', () => {
    service.getById('1').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should verify if ID exists', () => {
    service.verifyIdExists('1').subscribe(result => {
      expect(result).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should create a product', () => {
    service.create(mockProduct).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({ success: true });
  });

  it('should update a product', () => {
    const updates = { name: 'Cuenta Ahorros Premium' };
    service.update('1', updates).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updates);
    req.flush({ success: true });
  });

  it('should delete a product', () => {
    service.delete('1').subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
