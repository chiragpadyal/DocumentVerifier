import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss'],
})
export class LeftComponent implements OnInit {
  @Input() connectableTo: any = ['database'];
  @Output() buttonClickEvent = new EventEmitter<string>();
  buttonArray = [
    { value: 'Database', key: 'database' },
    { value: 'API', key: 'api' },
    { value: 'Input', key: 'input' },
    { value: 'Aadhar Card', key: 'aadhar' },
    { value: 'Pan Card', key: 'pan' },
    { value: 'File', key: 'file' },
  ];
  constructor() {}

  ngOnInit(): void {}
  buttonClick(button: any) {
    this.buttonClickEvent.emit(button);
  }
}
