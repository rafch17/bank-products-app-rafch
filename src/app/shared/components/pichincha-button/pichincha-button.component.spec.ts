import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgStyle } from '@angular/common';
import { PichinchaButtonComponent } from './pichincha-button.component';
import { EventEmitter } from '@angular/core';

describe('PichinchaButtonComponent', () => {
  let component: PichinchaButtonComponent;
  let fixture: ComponentFixture<PichinchaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PichinchaButtonComponent, NgStyle]
    }).compileComponents();

    fixture = TestBed.createComponent(PichinchaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.label).toBe('Botón');
      expect(component.background).toBe('#fff4aa');
      expect(component.color).toBe('#ffdd00');
      expect(component.disabled).toBe(false);
    });

    it('should initialize textColor as undefined', () => {
      expect(component.textColor).toBeUndefined();
    });

    it('should have clicked EventEmitter', () => {
      expect(component.clicked).toBeDefined();
      expect(component.clicked).toBeInstanceOf(EventEmitter);
    });
  });

  describe('Input Properties', () => {
    it('should accept custom label', () => {
      const customLabel = 'Custom Button';
      component.label = customLabel;
      fixture.detectChanges();

      expect(component.label).toBe(customLabel);
    });

    it('should accept custom background color', () => {
      const customBackground = '#ff0000';
      component.background = customBackground;
      fixture.detectChanges();

      expect(component.background).toBe(customBackground);
    });

    it('should accept custom color', () => {
      const customColor = '#0000ff';
      component.color = customColor;
      fixture.detectChanges();

      expect(component.color).toBe(customColor);
    });

    it('should accept disabled state', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(component.disabled).toBe(true);
    });

    it('should handle boolean disabled input', () => {
      component.disabled = false;
      fixture.detectChanges();

      expect(component.disabled).toBe(false);
    });
  });

  describe('handleClick method', () => {
    it('should emit clicked event when not disabled', () => {
      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.disabled = false;

      component.handleClick();

      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith();
    });

    it('should not emit clicked event when disabled', () => {
      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.disabled = true;

      component.handleClick();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit clicked event multiple times when called multiple times', () => {
      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.disabled = false;

      component.handleClick();
      component.handleClick();
      component.handleClick();

      expect(emitSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Output Events', () => {
    it('should emit clicked event through output', () => {
      let clickedEmitted = false;
      component.clicked.subscribe(() => {
        clickedEmitted = true;
      });

      component.handleClick();

      expect(clickedEmitted).toBe(true);
    });

    it('should pass data through clicked event', (done) => {
      component.clicked.subscribe((data) => {
        expect(data).toBeUndefined(); // El evento emite void
        done();
      });

      component.handleClick();
    });
  });

  describe('Component Integration', () => {
    it('should render with default properties', () => {
      const compiled = fixture.nativeElement;
      expect(compiled).toBeTruthy();
    });

    it('should handle property changes', () => {
      const newLabel = 'Updated Button';
      const newBackground = '#00ff00';
      const newColor = '#ff00ff';

      component.label = newLabel;
      component.background = newBackground;
      component.color = newColor;
      component.disabled = true;

      fixture.detectChanges();

      expect(component.label).toBe(newLabel);
      expect(component.background).toBe(newBackground);
      expect(component.color).toBe(newColor);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string label', () => {
      component.label = '';
      fixture.detectChanges();

      expect(component.label).toBe('');
    });

    it('should handle null/undefined values gracefully', () => {
      // Test setting properties to edge case values
      component.label = null as any;
      component.background = undefined as any;
      component.color = null as any;

      fixture.detectChanges();

      expect(component.label).toBeNull();
      expect(component.background).toBeUndefined();
      expect(component.color).toBeNull();
    });

    it('should handle rapid successive clicks when enabled', () => {
      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.disabled = false;

      // Simulate rapid clicks
      for (let i = 0; i < 5; i++) {
        component.handleClick();
      }

      expect(emitSpy).toHaveBeenCalledTimes(5);
    });

    it('should handle rapid successive clicks when disabled', () => {
      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.disabled = true;

      // Simulate rapid clicks
      for (let i = 0; i < 5; i++) {
        component.handleClick();
      }

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('State Changes', () => {
    it('should handle disabled state change from false to true', () => {
      component.disabled = false;
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.handleClick();
      expect(emitSpy).toHaveBeenCalled();

      // Change to disabled
      component.disabled = true;
      fixture.detectChanges();

      emitSpy.mockClear();
      component.handleClick();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should handle disabled state change from true to false', () => {
      component.disabled = true;
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.handleClick();
      expect(emitSpy).not.toHaveBeenCalled();

      // Change to enabled
      component.disabled = false;
      fixture.detectChanges();

      component.handleClick();
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('Type Safety', () => {
    it('should handle string inputs correctly', () => {
      const label = 'Test Label';
      const background = '#ffffff';
      const color = '#000000';

      component.label = label;
      component.background = background;
      component.color = color;

      expect(typeof component.label).toBe('string');
      expect(typeof component.background).toBe('string');
      expect(typeof component.color).toBe('string');
    });

    it('should handle boolean disabled input correctly', () => {
      component.disabled = true;
      expect(typeof component.disabled).toBe('boolean');
      expect(component.disabled).toBe(true);

      component.disabled = false;
      expect(typeof component.disabled).toBe('boolean');
      expect(component.disabled).toBe(false);
    });
  });

  describe('Event Emitter Behavior', () => {
    it('should have working event emitter subscription', () => {
      let eventReceived = false;
      const subscription = component.clicked.subscribe(() => {
        eventReceived = true;
      });

      component.handleClick();

      expect(eventReceived).toBe(true);
      subscription.unsubscribe();
    });

    it('should handle multiple subscribers', () => {
      let subscriber1Called = false;
      let subscriber2Called = false;

      const sub1 = component.clicked.subscribe(() => {
        subscriber1Called = true;
      });

      const sub2 = component.clicked.subscribe(() => {
        subscriber2Called = true;
      });

      component.handleClick();

      expect(subscriber1Called).toBe(true);
      expect(subscriber2Called).toBe(true);

      sub1.unsubscribe();
      sub2.unsubscribe();
    });

    it('should not emit after unsubscribe', () => {
      let eventReceived = false;
      const subscription = component.clicked.subscribe(() => {
        eventReceived = true;
      });

      subscription.unsubscribe();
      component.handleClick();

      expect(eventReceived).toBe(false);
    });
  });

  describe('Component Lifecycle', () => {
    it('should maintain state across detection cycles', () => {
      component.label = 'Test';
      component.background = '#test';
      component.color = '#test2';
      component.disabled = true;

      fixture.detectChanges();

      expect(component.label).toBe('Test');
      expect(component.background).toBe('#test');
      expect(component.color).toBe('#test2');
      expect(component.disabled).toBe(true);
    });
  });
});