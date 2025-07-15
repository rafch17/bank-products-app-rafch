import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PichinchaModalComponent } from './pichincha-modal.component';

describe('PichinchaModalComponent', () => {
  let component: PichinchaModalComponent;
  let fixture: ComponentFixture<PichinchaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PichinchaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PichinchaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
