import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { PichinchaModalComponent } from './pichincha-modal.component';
import { PichinchaButtonComponent } from '../pichincha-button/pichincha-button.component';

describe('PichinchaModalComponent', () => {
  let component: PichinchaModalComponent;
  let fixture: ComponentFixture<PichinchaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PichinchaModalComponent, CommonModule, PichinchaButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PichinchaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.title).toBe('');
      expect(component.show).toBe(false);
    });

    it('should have close EventEmitter', () => {
      expect(component.close).toBeDefined();
      expect(component.close).toBeInstanceOf(EventEmitter);
    });

    it('should have confirm EventEmitter', () => {
      expect(component.confirm).toBeDefined();
      expect(component.confirm).toBeInstanceOf(EventEmitter);
    });
  });

  describe('Input Properties', () => {
    it('should accept custom title', () => {
      const customTitle = 'Custom Modal Title';
      component.title = customTitle;
      fixture.detectChanges();

      expect(component.title).toBe(customTitle);
    });

    it('should accept show as true', () => {
      component.show = true;
      fixture.detectChanges();

      expect(component.show).toBe(true);
    });

    it('should accept show as false', () => {
      component.show = false;
      fixture.detectChanges();

      expect(component.show).toBe(false);
    });

    it('should handle empty string title', () => {
      component.title = '';
      fixture.detectChanges();

      expect(component.title).toBe('');
    });

    it('should handle long title', () => {
      const longTitle = 'This is a very long title that might be used in a modal component';
      component.title = longTitle;
      fixture.detectChanges();

      expect(component.title).toBe(longTitle);
    });
  });

  describe('onClose method', () => {
    it('should emit close event', () => {
      const emitSpy = jest.spyOn(component.close, 'emit');

      component.onClose();

      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith();
    });

    it('should emit close event multiple times when called multiple times', () => {
      const emitSpy = jest.spyOn(component.close, 'emit');

      component.onClose();
      component.onClose();
      component.onClose();

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });

    it('should emit close event regardless of show state', () => {
      const emitSpy = jest.spyOn(component.close, 'emit');

      // Test when show is false
      component.show = false;
      component.onClose();
      expect(emitSpy).toHaveBeenCalled();

      emitSpy.mockClear();

      // Test when show is true
      component.show = true;
      component.onClose();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('onConfirm method', () => {
    it('should emit confirm event', () => {
      const emitSpy = jest.spyOn(component.confirm, 'emit');

      component.onConfirm();

      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith();
    });

    it('should emit confirm event multiple times when called multiple times', () => {
      const emitSpy = jest.spyOn(component.confirm, 'emit');

      component.onConfirm();
      component.onConfirm();
      component.onConfirm();

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });

    it('should emit confirm event regardless of show state', () => {
      const emitSpy = jest.spyOn(component.confirm, 'emit');

      // Test when show is false
      component.show = false;
      component.onConfirm();
      expect(emitSpy).toHaveBeenCalled();

      emitSpy.mockClear();

      // Test when show is true
      component.show = true;
      component.onConfirm();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('Output Events', () => {
    it('should emit close event through output', () => {
      let closeEmitted = false;
      component.close.subscribe(() => {
        closeEmitted = true;
      });

      component.onClose();

      expect(closeEmitted).toBe(true);
    });

    it('should emit confirm event through output', () => {
      let confirmEmitted = false;
      component.confirm.subscribe(() => {
        confirmEmitted = true;
      });

      component.onConfirm();

      expect(confirmEmitted).toBe(true);
    });

    it('should pass void data through close event', (done) => {
      component.close.subscribe((data) => {
        expect(data).toBeUndefined();
        done();
      });

      component.onClose();
    });

    it('should pass void data through confirm event', (done) => {
      component.confirm.subscribe((data) => {
        expect(data).toBeUndefined();
        done();
      });

      component.onConfirm();
    });
  });

  describe('Component Integration', () => {
    it('should render with default properties', () => {
      const compiled = fixture.nativeElement;
      expect(compiled).toBeTruthy();
    });

    it('should handle property changes', () => {
      const newTitle = 'Updated Modal Title';
      const newShow = true;

      component.title = newTitle;
      component.show = newShow;

      fixture.detectChanges();

      expect(component.title).toBe(newTitle);
      expect(component.show).toBe(newShow);
    });

    it('should maintain state across detection cycles', () => {
      component.title = 'Test Modal';
      component.show = true;

      fixture.detectChanges();

      expect(component.title).toBe('Test Modal');
      expect(component.show).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined title gracefully', () => {
      component.title = null as any;
      fixture.detectChanges();
      expect(component.title).toBeNull();

      component.title = undefined as any;
      fixture.detectChanges();
      expect(component.title).toBeUndefined();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Modal with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      component.title = specialTitle;
      fixture.detectChanges();

      expect(component.title).toBe(specialTitle);
    });

    it('should handle HTML content in title', () => {
      const htmlTitle = '<b>Bold Title</b>';
      component.title = htmlTitle;
      fixture.detectChanges();

      expect(component.title).toBe(htmlTitle);
    });

    it('should handle rapid successive method calls', () => {
      const closeEmitSpy = jest.spyOn(component.close, 'emit');
      const confirmEmitSpy = jest.spyOn(component.confirm, 'emit');

      // Rapid close calls
      for (let i = 0; i < 5; i++) {
        component.onClose();
      }

      // Rapid confirm calls
      for (let i = 0; i < 5; i++) {
        component.onConfirm();
      }

      expect(closeEmitSpy).toHaveBeenCalledTimes(5);
      expect(confirmEmitSpy).toHaveBeenCalledTimes(5);
    });
  });

  describe('State Changes', () => {
    it('should handle show state changes', () => {
      // Initial state
      expect(component.show).toBe(false);

      // Change to true
      component.show = true;
      fixture.detectChanges();
      expect(component.show).toBe(true);

      // Change back to false
      component.show = false;
      fixture.detectChanges();
      expect(component.show).toBe(false);
    });

    it('should handle title changes', () => {
      const firstTitle = 'First Title';
      const secondTitle = 'Second Title';

      component.title = firstTitle;
      fixture.detectChanges();
      expect(component.title).toBe(firstTitle);

      component.title = secondTitle;
      fixture.detectChanges();
      expect(component.title).toBe(secondTitle);
    });
  });

  describe('Event Emitter Behavior', () => {
    it('should have working close event emitter subscription', () => {
      let eventReceived = false;
      const subscription = component.close.subscribe(() => {
        eventReceived = true;
      });

      component.onClose();

      expect(eventReceived).toBe(true);
      subscription.unsubscribe();
    });

    it('should have working confirm event emitter subscription', () => {
      let eventReceived = false;
      const subscription = component.confirm.subscribe(() => {
        eventReceived = true;
      });

      component.onConfirm();

      expect(eventReceived).toBe(true);
      subscription.unsubscribe();
    });

    it('should handle multiple subscribers for close event', () => {
      let subscriber1Called = false;
      let subscriber2Called = false;

      const sub1 = component.close.subscribe(() => {
        subscriber1Called = true;
      });

      const sub2 = component.close.subscribe(() => {
        subscriber2Called = true;
      });

      component.onClose();

      expect(subscriber1Called).toBe(true);
      expect(subscriber2Called).toBe(true);

      sub1.unsubscribe();
      sub2.unsubscribe();
    });

    it('should handle multiple subscribers for confirm event', () => {
      let subscriber1Called = false;
      let subscriber2Called = false;

      const sub1 = component.confirm.subscribe(() => {
        subscriber1Called = true;
      });

      const sub2 = component.confirm.subscribe(() => {
        subscriber2Called = true;
      });

      component.onConfirm();

      expect(subscriber1Called).toBe(true);
      expect(subscriber2Called).toBe(true);

      sub1.unsubscribe();
      sub2.unsubscribe();
    });

    it('should not emit after unsubscribe', () => {
      let closeEventReceived = false;
      let confirmEventReceived = false;

      const closeSubscription = component.close.subscribe(() => {
        closeEventReceived = true;
      });

      const confirmSubscription = component.confirm.subscribe(() => {
        confirmEventReceived = true;
      });

      closeSubscription.unsubscribe();
      confirmSubscription.unsubscribe();

      component.onClose();
      component.onConfirm();

      expect(closeEventReceived).toBe(false);
      expect(confirmEventReceived).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should handle string title input correctly', () => {
      const title = 'Test Title';
      component.title = title;

      expect(typeof component.title).toBe('string');
      expect(component.title).toBe(title);
    });

    it('should handle boolean show input correctly', () => {
      component.show = true;
      expect(typeof component.show).toBe('boolean');
      expect(component.show).toBe(true);

      component.show = false;
      expect(typeof component.show).toBe('boolean');
      expect(component.show).toBe(false);
    });
  });

  describe('Component Lifecycle', () => {
    it('should maintain properties after multiple change detection cycles', () => {
      component.title = 'Persistent Title';
      component.show = true;

      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      expect(component.title).toBe('Persistent Title');
      expect(component.show).toBe(true);
    });

    it('should handle simultaneous property changes', () => {
      component.title = 'New Title';
      component.show = true;

      fixture.detectChanges();

      expect(component.title).toBe('New Title');
      expect(component.show).toBe(true);
    });
  });

  describe('Method Independence', () => {
    it('should allow onClose and onConfirm to be called independently', () => {
      const closeEmitSpy = jest.spyOn(component.close, 'emit');
      const confirmEmitSpy = jest.spyOn(component.confirm, 'emit');

      component.onClose();
      expect(closeEmitSpy).toHaveBeenCalled();
      expect(confirmEmitSpy).not.toHaveBeenCalled();

      closeEmitSpy.mockClear();
      confirmEmitSpy.mockClear();

      component.onConfirm();
      expect(confirmEmitSpy).toHaveBeenCalled();
      expect(closeEmitSpy).not.toHaveBeenCalled();
    });

    it('should allow both methods to be called in sequence', () => {
      const closeEmitSpy = jest.spyOn(component.close, 'emit');
      const confirmEmitSpy = jest.spyOn(component.confirm, 'emit');

      component.onClose();
      component.onConfirm();

      expect(closeEmitSpy).toHaveBeenCalled();
      expect(confirmEmitSpy).toHaveBeenCalled();
    });
  });
});