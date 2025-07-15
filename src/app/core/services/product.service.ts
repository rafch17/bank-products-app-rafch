import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  verifyIdExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }

  create(product: Product): Observable<any> {
    return this.http.post(this.baseUrl, product);
  }

  update(id: string, product: Partial<Product>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
