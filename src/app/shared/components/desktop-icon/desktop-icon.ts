import {
  Component,
  computed,
  HostBinding,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { DialogService } from '../../services/dialog-service';

@Component({
  selector: 'app-desktop-icon',
  imports: [],
  templateUrl: './desktop-icon.html',
  styleUrl: './desktop-icon.scss',
})
export class DesktopIcon {
  private readonly dialogService = inject(DialogService);

  readonly icon = input('assets/icons/Internet Explorer 6.png');
  readonly name = input('Internet Explorer');
  readonly component = input<ComponentType<unknown>>();

  private readonly isDragging = signal(false);
  private readonly offsetX = signal(0);
  private readonly offsetY = signal(0);
  private readonly x = signal(window.innerWidth / 2 - 36);
  private readonly y = signal(window.innerHeight / 2 - 36);
  private readonly selected = signal(false);

  readonly isSelected = computed(() => this.selected());

  @HostBinding('style.transform')
  readonly transform = computed(
    () => `translate(${this.x()}px, ${this.y()}px)`,
  );

  startDrag(event: MouseEvent) {
    event.preventDefault();
    this.isDragging.set(true);
    this.offsetX.set(event.clientX - this.x());
    this.offsetY.set(event.clientY - this.y());
  }

  @HostListener('document:mousemove', ['$event'])
  onMove(event: MouseEvent) {
    if (!this.isDragging()) return;

    this.x.set(event.clientX - this.offsetX());
    this.y.set(event.clientY - this.offsetY());
  }

  @HostListener('document:mouseup')
  stopDrag() {
    this.isDragging.set(false);
  }

  select(event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    this.selected.set(true);
  }

  @HostListener('document:click', ['$event'])
  deselectAll(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.desktop-icon')) {
      this.selected.set(false);
    }
  }

  openDialog(): void {
    const componentToOpen = this.component();
    if (!componentToOpen) {
      return;
    }

    this.dialogService
      .open(componentToOpen, {
        icon: this.icon(),
        name: this.name(),
      })
      .subscribe();
  }
}
