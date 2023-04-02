import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss'],
})
export class RightComponent implements OnInit {
  @Input() properties: any = '';
  @Input() refNodeData: any = '';
  @Output() getNodeData = new EventEmitter<any>();
  @Output() refNodeChangeEvent = new EventEmitter<any>();
  window: Window;

  constructor() {}
  ngOnInit(): void {
    this.window = window;
  }

  sendEvent(nodeType: any) {
    this.getNodeData.emit(nodeType);
  }

  refNodeChange(sourceNode, destNode, value) {
    this.refNodeChangeEvent.emit([sourceNode, destNode, value]);
  }
}
