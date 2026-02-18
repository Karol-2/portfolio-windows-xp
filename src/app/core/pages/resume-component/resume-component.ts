import { Component } from '@angular/core';

@Component({
  selector: 'app-resume-component',
  imports: [],
  templateUrl: './resume-component.html',
  styleUrl: './resume-component.scss',
})
export class ResumeComponent {
  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
