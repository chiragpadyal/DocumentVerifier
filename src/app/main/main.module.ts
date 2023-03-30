import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphModule, NgxGraphModule } from '@swimlane/ngx-graph';
import { MainComponent } from './main.component';
import { RightComponent } from './right/right.component';
import { LeftComponent } from './left/left.component';
import { GraphComponent } from './graph/graph.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [MainComponent, RightComponent, LeftComponent, GraphComponent],
  imports: [CommonModule, GraphModule, NgxGraphModule, FormsModule],
})
export class MainModule {}
