import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pichincha-button',
  imports: [NgStyle],
  templateUrl: './pichincha-button.component.html',
  styleUrl: './pichincha-button.component.scss',
  standalone: true

})
export class PichinchaButtonComponent {
  @Input() label: string = 'Botón';
  @Input() background: string = '#fff4aa';
  @Input() color: string = '#ffdd00';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();
textColor: any;

  handleClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
