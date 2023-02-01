import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input()
  isOpen = false;

  @Output()
  onClose = new EventEmitter<string>();

  ngOnInit() { }

  closePopup() {
    this.isOpen = false;
    this.onClose.emit('Pop-up window closed');
  }
}
