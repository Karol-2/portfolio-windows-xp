import { Routes } from '@angular/router';
import { LoggedInPage } from './core/pages/logged-in-page/logged-in-page';
import { appRoutesEnum } from './core/enums/routes.enum';

export const routes: Routes = [
  {
    path: appRoutesEnum.turnedOn,
    component: LoggedInPage,
  },
  // {
  //   path: appRoutesEnum.tunredOff,
  //   component: TurnedOffPage,
  // },
  // {
  //   path: appRoutesEnum.loggedOut,
  //   component: LoggedOutPage,
  // },
  //TODO: add log in and log out screen
];
