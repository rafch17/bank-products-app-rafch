import { Component, HostListener } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  standalone: false
})
export class ProductListComponent {

  isLoading = true;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  openedMenuIndex: number | null = -1;
  searchQuery: string = '';
  selectedProductName: string = '';
  selectedProductId: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  showDeleteModal = false;


  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);
    this.changePageSize(value);
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }


  toggleActionsMenu(index: number) {
    this.openedMenuIndex = this.openedMenuIndex === index ? -1 : index;
  }

  onEdit(productId: string) {
    this.router.navigate(['/products/form', productId]);
    this.openedMenuIndex = null;
  }

  onDelete(productId: string) {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      this.productService.delete(productId).subscribe(() => {
        this.loadProducts();
      });
    }
    this.openedMenuIndex = null;
  }


  loadProducts() {
    this.isLoading = true;


    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.updateDisplayedProducts();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err)

      }
    });



  }
  deleteProduct(product: Product) {
    this.showDeleteModal = true;
    this.selectedProductName = product.name;
    this.selectedProductId = product.id;
  }
  confirmDeleteProduct(id: string) {
    this.productService.delete(id).subscribe({
      next: () => {
        this.loadProducts();
        this.showDeleteModal = false;
      },
      error: (err) => {
        this.showDeleteModal = false;
        console.error(err)
        alert('Error al eliminar producto')
      }
    });
    this.openedMenuIndex = null;

  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.actions-cell')) {
      this.openedMenuIndex = -1;
    }
  }


}
