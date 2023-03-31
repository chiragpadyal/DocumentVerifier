import { Component, OnInit, ViewChild } from '@angular/core';
import { graphData } from './graph.data';
import { GraphComponent } from './graph/graph.component';
import { cloneDeep } from 'lodash';
import { ElectronService } from '../core/services';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild(GraphComponent) graphComp: GraphComponent;
  selectedNode: any = { id: 1, label: 'root' };
  graph: any = null;
  spacer = 7;

  nodes = [
    {
      id: '1',
      label: 'root',
      properties: [],
      connectedTo: [],
      isComplete: false,
      isFailed: false,
    },
  ];
  edges = [];
  constructor(private electronService: ElectronService) {
    this.graph = graphData;
  }
  selectedNodeProperties = () => {
    const val = this.nodes.find((obj) => obj.id === this.selectedNode.id);
    // console.log(val);
    return val;
  };

  ngOnInit(): void {}
  nodeChange(nodeId: any) {
    this.selectedNode = nodeId;
    // console.log(this.selectedNode);
  }
  buttonClick(button: any) {
    if (button === 'play') {
      // console.log(this.nodes);
      // console.log(this.edges);
      // send data to express
      if (this.electronService.isElectron) {
        // console.log(process.env);
        // console.log('Run in electron');
        // console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
        // console.log('NodeJS childProcess', this.electronService.childProcess);
        this.electronService.ipcRenderer.on('my-message', (event, arg, id) => {
          console.log('recieved');
          console.log(arg); // Log the received message

          const nodeToUpdate = this.nodes.find((n) => n.id === id);

          if (arg === 'complete') {
            if (nodeToUpdate.isComplete === false) {
              nodeToUpdate.isComplete = true;
              nodeToUpdate.isFailed = false;
            } else {
              nodeToUpdate.isComplete = true;
              nodeToUpdate.isFailed = false;
            }
          } else if (arg === 'failed') {
            if (nodeToUpdate.isFailed === false) {
              nodeToUpdate.isFailed = true;
              nodeToUpdate.isComplete = false;
            } else {
              nodeToUpdate.isFailed = true;
              nodeToUpdate.isComplete = false;
            }
          } else {
            console.log('wrong reply from electronjs');
          }
        });

        this.electronService.ipcRenderer.send('my-message', {
          nodes: this.nodes,
          edges: this.edges,
        });
      }
      return false;
    }

    console.log(button);
    this.addNode(button, this.selectedNode.id);
    // this.graphComp.addNode(button, this.selectedNode.id);
  }
  addNode(name: any, parentId: any) {
    const newID = this.spacer + 1;
    const properties = this.graph?.[name].properties ?? [];
    const connectedTo = this.graph?.[name].connectedTo ?? [];

    this.nodes.push({
      id: `${newID}`,
      label: name,
      properties: cloneDeep(properties),
      connectedTo: [...connectedTo],
      isComplete: false,
      isFailed: false,
    });

    if (parentId) {
      this.edges.push({
        id: 'a',
        source: parentId,
        target: `${newID}`,
      });
    }
    this.spacer += 1;

    this.graphComp.updateGraph();
  }
}
