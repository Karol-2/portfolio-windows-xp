import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  afterNextRender,
} from '@angular/core';
import { AppDialogData } from '../../models/app-dialog-data.model';

@Component({
  selector: 'app-window',
  imports: [CdkPortalOutlet],
  templateUrl: './window.html',
  styleUrl: './window.scss',
})
export class WindowComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly dialogRef = inject(DialogRef);
  readonly data = inject<AppDialogData>(DIALOG_DATA);

  readonly icon = signal('assets/icons/Internet Explorer 6.png');
  readonly name = signal('Internet Explorer');

  readonly isActive = signal(true);
  readonly width = signal(600);
  readonly height = signal(400);
  readonly isMaximized = signal(false);

  private readonly footerHeight = 32; // Footer height in pixels
  private savedWidth = 600;
  private savedHeight = 400;
  private savedLeft = 100;
  private savedTop = 100;

  private isDragging = false;
  private isResizing = false;
  private resizeDirection: string | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private startLeft = 0;
  private startTop = 0;

  constructor() {
    this.icon.set(this.data.data.icon);
    this.name.set(this.data.data.name);

    afterNextRender(() => {
      const dialogElement = this.getDialogContainer();
      if (dialogElement) {
        if (!dialogElement.style.left || dialogElement.style.left === '') {
          dialogElement.style.setProperty('left', '100px', 'important');
          dialogElement.style.setProperty('top', '100px', 'important');
        }
        dialogElement.style.setProperty('transform', 'none', 'important');
        dialogElement.style.setProperty('margin', '0', 'important');
      }
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.isMaximized()) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - this.footerHeight;
      this.width.set(viewportWidth);
      this.height.set(viewportHeight);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing && this.resizeDirection) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return;
      }

      const dialogElement = this.elementRef.nativeElement.closest(
        '.cdk-dialog-container',
      ) as HTMLElement;

      if (this.resizeDirection.includes('e')) {
        // Resizing from east (right)
        const newWidth = Math.max(300, this.startWidth + deltaX);
        this.width.set(newWidth);
      }
      if (this.resizeDirection.includes('w')) {
        // Resizing from west (left)
        const newWidth = Math.max(300, this.startWidth - deltaX);
        this.width.set(newWidth);
        if (dialogElement) {
          // Move left by the amount width decreased
          const widthChange = this.startWidth - newWidth;
          dialogElement.style.left = `${this.startLeft + widthChange}px`;
        }
      }

      // Handle height changes
      if (this.resizeDirection.includes('s')) {
        // Resizing from south (bottom)
        const newHeight = Math.max(200, this.startHeight + deltaY);
        this.height.set(newHeight);
      }
      if (this.resizeDirection.includes('n')) {
        // Resizing from north (top)
        const newHeight = Math.max(200, this.startHeight - deltaY);
        this.height.set(newHeight);
        if (dialogElement) {
          // Move top by the amount height decreased
          const heightChange = this.startHeight - newHeight;
          dialogElement.style.top = `${this.startTop + heightChange}px`;
        }
      }
    } else if (this.isDragging) {
      event.preventDefault();
      const dialogElement = this.getDialogContainer();
      if (dialogElement) {
        const newLeft = event.clientX - this.startX;
        const newTop = event.clientY - this.startY;

        dialogElement.style.setProperty('left', `${newLeft}px`, 'important');
        dialogElement.style.setProperty('top', `${newTop}px`, 'important');
        dialogElement.style.setProperty('transform', 'none', 'important');
        dialogElement.style.setProperty('margin', '0', 'important');
        dialogElement.style.setProperty('right', 'auto', 'important');
        dialogElement.style.setProperty('bottom', 'auto', 'important');
      }
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeDirection = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isDragging) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(
      event.target as Node,
    );

    this.isActive.set(clickedInside);
  }

  close() {
    this.dialogRef.close();
  }

  toggleMaximize() {
    if (this.isMaximized()) {
      this.restore();
    } else {
      this.maximize();
    }
  }

  maximize() {
    const dialogElement = this.getDialogContainer();
    if (!dialogElement) return;

    const rect = dialogElement.getBoundingClientRect();
    this.savedWidth = this.width();
    this.savedHeight = this.height();
    this.savedLeft = rect.left;
    this.savedTop = rect.top;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - this.footerHeight;
    this.width.set(viewportWidth);
    this.height.set(viewportHeight);
    this.isMaximized.set(true);

    dialogElement.style.setProperty('left', '0px', 'important');
    dialogElement.style.setProperty('top', '0px', 'important');
    dialogElement.style.setProperty('right', 'auto', 'important');
    dialogElement.style.setProperty('bottom', 'auto', 'important');
    dialogElement.style.setProperty('transform', 'none', 'important');
    dialogElement.style.setProperty('margin', '0', 'important');
  }

  restore() {
    const dialogElement = this.getDialogContainer();
    if (!dialogElement) return;

    this.width.set(this.savedWidth);
    this.height.set(this.savedHeight);
    this.isMaximized.set(false);

    dialogElement.style.setProperty('left', `${this.savedLeft}px`, 'important');
    dialogElement.style.setProperty('top', `${this.savedTop}px`, 'important');
    dialogElement.style.setProperty('right', 'auto', 'important');
    dialogElement.style.setProperty('bottom', 'auto', 'important');
    dialogElement.style.setProperty('transform', 'none', 'important');
    dialogElement.style.setProperty('margin', '0', 'important');
  }

  startDrag(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.window-button')) {
      return;
    }
    // Don't allow dragging when maximized
    if (this.isMaximized()) {
      return;
    }
    this.isDragging = true;
    const dialogElement = this.getDialogContainer();
    if (dialogElement) {
      const rect = dialogElement.getBoundingClientRect();
      this.startX = event.clientX - rect.left;
      this.startY = event.clientY - rect.top;
      this.startLeft = rect.left;
      this.startTop = rect.top;

      dialogElement.style.setProperty('left', `${rect.left}px`, 'important');
      dialogElement.style.setProperty('top', `${rect.top}px`, 'important');
      dialogElement.style.setProperty('transform', 'none', 'important');
      dialogElement.style.setProperty('margin', '0', 'important');
    }
    event.preventDefault();
    event.stopPropagation();
  }

  startResize(event: MouseEvent, direction: string) {
    if (this.isMaximized()) {
      return;
    }
    this.isResizing = true;
    this.resizeDirection = direction;
    const dialogElement = this.elementRef.nativeElement.closest(
      '.cdk-dialog-container',
    ) as HTMLElement;
    const rect = dialogElement
      ? dialogElement.getBoundingClientRect()
      : this.elementRef.nativeElement.getBoundingClientRect();
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.startWidth = this.width();
    this.startHeight = this.height();
    this.startLeft = rect.left;
    this.startTop = rect.top;
    event.preventDefault();
    event.stopPropagation();
  }

  private getDialogContainer(): HTMLElement | null {
    let container = this.elementRef.nativeElement.closest(
      '.cdk-overlay-pane',
    ) as HTMLElement;
    if (!container) {
      container = this.elementRef.nativeElement.closest(
        '.cdk-dialog-container',
      ) as HTMLElement;
    }
    if (!container) {
      const overlays = document.querySelectorAll('.cdk-overlay-pane');
      if (overlays.length > 0) {
        for (const overlay of Array.from(overlays)) {
          if (
            (overlay as HTMLElement).contains(this.elementRef.nativeElement)
          ) {
            container = overlay as HTMLElement;
            break;
          }
        }
      }
    }
    return container;
  }
}
