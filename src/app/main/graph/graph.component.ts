import { Component, EventEmitter, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  update$: Subject<boolean> = new Subject();
  screenHeight = 10000;
  screenWidth = 10000;
  spacer = 7;
  clickView: EventEmitter<MouseEvent> | undefined;
  edges = [
    {
      id: 'a',
      source: '1',
      target: '2',
    },
    {
      id: 'b',
      source: '1',
      target: '3',
    },
    {
      id: 'c',
      source: '3',
      target: '4',
    },
    {
      id: 'd',
      source: '3',
      target: '5',
    },
    {
      id: 'e',
      source: '4',
      target: '5',
    },
    {
      id: 'f',
      source: '2',
      target: '6',
    },
  ];

  nodes = [
    {
      id: '1',
      label: 'Node A',
    },
    {
      id: '2',
      label: 'Node B',
    },
    {
      id: '3',
      label: 'Node C',
    },
    {
      id: '4',
      label: 'Node D',
    },
    {
      id: '5',
      label: 'Node E',
    },
    {
      id: '6',
      label: 'Node F',
    },
  ];

  clusters = [
    {
      id: 'cluster0',
      label: 'Cluster node',
      childNodeIds: ['2', '3'],
    },
  ];
  constructor(private router: Router) {
    this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: any) {
    this.screenHeight = window.outerHeight;
    this.screenWidth = window.outerWidth;
    console.log(this.screenHeight, this.screenWidth);
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onNodeClick(e: any) {
    this.nodes.push({
      id: `${this.spacer + 1}`,
      label: 'Node K',
    });
    this.edges.push({
      id: 'a',
      source: e.id,
      target: `${this.spacer + 1}`,
    });
    this.spacer += 1;
    this.updateGraph();
  }

  updateGraph() {
    this.update$.next(true);
  }
}
