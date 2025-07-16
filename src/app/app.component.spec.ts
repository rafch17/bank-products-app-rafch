import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should have correct component properties', () => {
    expect(component.constructor.name).toBe('AppComponent');
  });

  // Test para verificar que el componente se inicializa correctamente
  it('should initialize component without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  // Test para verificar que el template se renderiza sin errores
  it('should render template without errors', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeDefined();
    expect(compiled.innerHTML).toBeDefined();
  });

  // Test para verificar que el componente se puede instanciar
  it('should be instance of AppComponent', () => {
    expect(component instanceof AppComponent).toBeTruthy();
  });
});