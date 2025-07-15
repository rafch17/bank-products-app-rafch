import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PichinchaButtonComponent } from './pichincha-button.component';

describe('PichinchaButtonComponent', () => {
  let component: PichinchaButtonComponent;
  let fixture: ComponentFixture<PichinchaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PichinchaButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PichinchaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
