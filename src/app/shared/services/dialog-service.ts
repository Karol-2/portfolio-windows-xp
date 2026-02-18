import {
  Dialog,
  DIALOG_DATA,
  DialogConfig,
  DialogRef,
} from '@angular/cdk/dialog';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { WindowComponent } from '../components/window/window';
import { AppDialogData } from '../models/app-dialog-data.model';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly dialog = inject(Dialog);
  private readonly injector = inject(Injector);
  private currentDialogRef: DialogRef<unknown, unknown> | null = null;
  private readonly openDialogs = new Set<DialogRef<unknown, unknown>>();

  getCurrentDialog(): DialogRef<unknown, unknown> | null {
    return this.currentDialogRef;
  }

  getAllDialogs(): readonly DialogRef<unknown, unknown>[] {
    return Array.from(this.openDialogs);
  }

  getDialogCount(): number {
    return this.openDialogs.size;
  }

  hasOpenDialog(): boolean {
    return this.openDialogs.size > 0;
  }

  isDialogOpen(dialogRef: DialogRef<unknown, unknown>): boolean {
    return this.openDialogs.has(dialogRef);
  }

  closeCurrentDialog(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
  }

  closeAllDialogs(): void {
    const dialogs = Array.from(this.openDialogs);
    dialogs.forEach((dialogRef) => {
      dialogRef.close();
    });
  }

  open<TData = unknown, TResult = unknown>(
    contentComponent: ComponentType<unknown>,
    data?: TData,
    config?: Partial<DialogConfig>,
  ): Observable<TResult | undefined> {
    const contentPortal = new ComponentPortal(
      contentComponent,
      null,
      Injector.create({
        providers: [{ provide: DIALOG_DATA, useValue: data }],
        parent: this.injector,
      }),
    );

    const dialogConfig: Partial<DialogConfig> = {
      ...config,
      hasBackdrop: false,
      data: {
        content: contentPortal,
        data: data,
      } as AppDialogData,
    };

    const dialogRef = this.dialog.open<TResult>(
      WindowComponent,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dialogConfig as any,
    );
    const typedDialogRef = dialogRef as DialogRef<unknown, unknown>;

    this.currentDialogRef = typedDialogRef;
    this.openDialogs.add(typedDialogRef);

    return dialogRef.closed.pipe(
      tap(() => {
        this.openDialogs.delete(typedDialogRef);

        if (this.currentDialogRef === typedDialogRef) {
          this.currentDialogRef = null;

          const remainingDialogs = Array.from(this.openDialogs);
          if (remainingDialogs.length > 0) {
            this.currentDialogRef =
              remainingDialogs[remainingDialogs.length - 1];
          }
        }
      }),
    );
  }
}
