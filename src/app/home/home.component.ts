import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ElectronService } from '../core/services';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('hiddenBtn') hiddenBtn: ElementRef;
  workflowData = {};
  inputFieldVal = 'dummy';
  setCurrentData = {};
  myVariable = false;

  constructor(
    private electronService: ElectronService,
    private router: Router,
    private changeDetectRef: ChangeDetectorRef
  ) {}

  get myVariableA(): boolean {
    return this.myVariable;
  }
  set myVariableA(value: boolean) {
    this.myVariable = value;
    setTimeout(() => {
      this.navigateToWorkflow(this.setCurrentData[0], this.setCurrentData[1]);
    }, 500); // add a 500ms delay before calling navigateToWorkflow()
  }

  ngOnInit(): void {
    this.refresh();
  }

  navigateToWorkflow(data, fileName: string) {
    console.log('data');
    console.log(data);
    const navigationExtras: NavigationExtras = {
      queryParams: { data: JSON.stringify(data), fileName },
    };
    this.router.navigate(['/main'], navigationExtras);
  }
  setCurrentDataFunc(data) {
    this.setCurrentData = data;
    this.hiddenBtn.nativeElement.click();
  }
  formatRelativeTime(dateString) {
    const date: Date = new Date(dateString); // parse the date string into a Date object
    const now: Date = new Date(); // create a new Date object with the current date and time
    const diff: number = now.getTime() - date.getTime(); // calculate the time difference in milliseconds

    // calculate the time difference in seconds, minutes, hours, and days
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // choose the appropriate time unit and format the time difference string
    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  }

  refresh() {
    if (this.electronService.isElectron) {
      // console.log(process.env);
      // console.log('Run in electron');
      // console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      // console.log('NodeJS childProcess', this.electronService.childProcess);
      this.electronService.ipcRenderer.on('get-all', (event, arg) => {
        this.workflowData = arg;
        // console.log(this.workflowData);
        this.changeDetectRef.detectChanges();
      });
      this.electronService.ipcRenderer.send('get-all', '');
    }
  }
}
