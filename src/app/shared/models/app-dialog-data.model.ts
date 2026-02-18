import { ComponentPortal } from '@angular/cdk/portal';

export interface AppDialogData {
  content: ComponentPortal<unknown>;
  data: {
    icon: string;
    name: string;
  };
}
