import { Component } from '@angular/core';
import { Desktop } from '../../components/desktop/desktop';
import { Footer } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-logged-in-page',
  imports: [Desktop, Footer],
  templateUrl: './logged-in-page.html',
  styleUrl: './logged-in-page.scss',
})
export class LoggedInPage {}
