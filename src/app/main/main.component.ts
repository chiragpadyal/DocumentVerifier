import { Component, OnInit, ViewChild } from '@angular/core';
import { graphData } from './graph.data';
import { GraphComponent } from './graph/graph.component';
import { cloneDeep } from 'lodash';
import { ElectronService } from '../core/services';
import { ActivatedRoute } from '@angular/router';
import { workerData } from 'worker_threads';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild(GraphComponent) graphComp: GraphComponent;
  selectedNode: any = { id: 1, label: 'root' };
  graph: any = null;
  refNodeData = [];
  projectName = 'temp';
  nodes = [
    {
      id: '1',
      label: 'root',
      properties: [],
      connectedTo: [],
      isComplete: false,
      isFailed: false,
      logs: '',
    },
  ];
  edges = [];
  constructor(
    private electronService: ElectronService,
    private route: ActivatedRoute
  ) {
    this.graph = graphData;
  }
  selectedNodeProperties = () => {
    const val = this.nodes.find((obj) => obj.id === this.selectedNode.id);
    // console.log(val);
    return val;
  };

  ngOnInit(): void {
    if (this.electronService.isElectron) {
      console.log('init workerData');

      const workflowData = JSON.parse(
        this.route.snapshot.queryParamMap.get('data')
      );
      console.log('before workerData');

      const workflowName = this.route.snapshot.queryParamMap.get('fileName');

      console.log(workflowName);
      console.log('after workerData');

      this.projectName = workflowName;
      console.log(workerData);
      console.log(workflowData.nodes);
      if ('nodes' in workflowData && 'edges' in workflowData) {
        this.nodes = workflowData.nodes;
        this.edges = workflowData.edges;
        this.graphComp.updateGraph();
      }
    }
  }
  nodeChange(nodeId: any) {
    this.selectedNode = nodeId;
    // console.log(this.selectedNode);
  }
  buttonClick(button: any) {
    if (button === 'save') {
      const now = new Date(); // create a new Date object with the current date and time
      const dateString = now.toLocaleString(); // format the Date object as a string in the local timezone
      if (this.electronService.isElectron) {
        this.electronService.ipcRenderer.send('store-data', {
          key: this.projectName,
          value: {
            nodes: this.nodes,
            edges: this.edges,
            modifyAt: dateString,
          },
        });
      }

      return false;
    }

    if (button === 'play') {
      // console.log(this.nodes);
      // console.log(this.edges);
      // send data to express
      if (this.electronService.isElectron) {
        // console.log(process.env);
        // console.log('Run in electron');
        // console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
        // console.log('NodeJS childProcess', this.electronService.childProcess);
        this.electronService.ipcRenderer.on(
          'my-message',
          (event, arg, id, logs) => {
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
            nodeToUpdate.logs = logs;
          }
        );

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
    const newID = this.nodes.length + 1;
    const properties = this.graph?.[name].properties ?? [];
    const connectedTo = this.graph?.[name].connectedTo ?? [];

    this.nodes.push({
      id: `${newID}`,
      label: name,
      properties: cloneDeep(properties),
      connectedTo: [...connectedTo],
      isComplete: false,
      isFailed: false,
      logs: '',
    });

    if (parentId) {
      this.edges.push({
        id: 'a',
        source: parentId,
        target: `${newID}`,
      });
    }
    // this.spacer += 1;

    this.graphComp.updateGraph();
  }
  getRefData(nodeType) {
    let list = [];
    console.log(nodeType);

    nodeType.forEach((element) => {
      console.log(element);
      const node = this.nodes.filter((n) => n.label === element);
      console.log(node);

      if (!node) {
        return false;
      }
      list = list.concat(node);
    });
    console.log(list);
    this.refNodeData = list;
  }

  getRefNodeChange(node) {
    const name = 'ref';
    const newID = this.nodes.length + 1;
    const properties = cloneDeep(this.graph?.[name].properties) ?? [];

    const connectedTo = this.graph?.[name].connectedTo ?? [];
    const source = node[0];
    const dest = node[1];
    const label = node[2];
    console.log(source);
    console.log(dest);
    properties[0].value = source.id;
    properties[1].value = dest;
    properties[2].value = label;
    this.nodes.push({
      id: `${newID}`,
      label: name,
      properties,
      connectedTo: [...connectedTo],
      isComplete: false,
      isFailed: false,
      logs: '',
    });
    this.edges.push({ id: 'a', source: source.id, target: newID });
    // this.spacer += 1;

    this.graphComp.updateGraph();
  }
}
