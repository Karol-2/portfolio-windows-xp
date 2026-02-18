import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { StartMenu } from '../start-menu/start-menu';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, StartMenu],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private timer!: ReturnType<typeof setInterval>;

  readonly date = signal<Date>(new Date());
  readonly startMenuVisible = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(
      event.target as Node,
    );

    if (!clickedInside) {
      this.startMenuVisible.set(false);
    }
  }
  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.date.set(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  changeStartMenuVisibility(): void {
    this.startMenuVisible.update((prev) => !prev);
  }
}
