import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  @Output() currentNodeEmitter = new EventEmitter<string>();
  @Input() nodes = [];
  @Input() edges = [];
  update$: Subject<boolean> = new Subject();
  screenHeight = 10000;
  screenWidth = 10000;
  clickView: EventEmitter<MouseEvent> | undefined;

  constructor(private router: Router) {
    this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log(this.screenHeight, this.screenWidth);
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  updateGraph() {
    this.update$.next(true);
  }
  nodeChange(nodeId: any) {
    this.currentNodeEmitter.emit(nodeId);
  }

  checkIfComplete(id) {
    return this.nodes.find((n) => n.id === id).isComplete;
  }

  checkIfFailed(id) {
    return this.nodes.find((n) => n.id === id).isFailed;
  }
}
