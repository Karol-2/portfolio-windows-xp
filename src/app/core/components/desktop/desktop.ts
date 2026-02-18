import { Component } from '@angular/core';
import { DesktopIcon } from '../../../shared/components/desktop-icon/desktop-icon';
import { ResumeComponent } from '../../pages/resume-component/resume-component';

@Component({
  selector: 'app-desktop',
  imports: [DesktopIcon],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class Desktop {
  readonly ResumeComponent = ResumeComponent;
}
