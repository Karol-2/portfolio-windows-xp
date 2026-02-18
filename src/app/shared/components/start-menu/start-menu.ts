import { Component, signal } from '@angular/core';
import { SideMenuOption } from '../../models/side-menu-option.model';

@Component({
  selector: 'app-start-menu',
  imports: [],
  templateUrl: './start-menu.html',
  styleUrl: './start-menu.scss',
})
export class StartMenu {
  readonly dynamicOptions = signal<SideMenuOption[]>([
    {
      name: 'Paint',
      icon: 'assets/icons/Paint.png',
    },
    {
      name: 'Notepad',
      icon: 'assets/icons/Notepad.png',
    },
    {
      name: 'Internet Explorer',
      icon: 'assets/icons/Internet Explorer 6.png',
    },
    {
      name: 'E-mail',
      icon: 'assets/icons/XPS Viewer.png',
    },
    {
      name: 'Windows Media Player',
      icon: 'assets/icons/Windows Media Player 9.png',
    },
  ]);
  readonly standardOptions = signal<SideMenuOption[]>([
    { name: 'My Documents', icon: 'assets/icons/My Documents.png' },
    { name: 'My Pictures', icon: 'assets/icons/My Pictures.png' },
    { name: 'My Music', icon: 'assets/icons/My Music.png' },
    { name: 'My Computer', icon: 'assets/icons/My Computer.png' },
    { name: 'Control Panel', icon: 'assets/icons/Control Panel.png' },
    { name: 'Printers', icon: 'assets/icons/Printers and Faxes.png' },
    { name: 'Help & Support', icon: 'assets/icons/Help and Support.png' },
    { name: 'Search', icon: 'assets/icons/Search.png' },
    { name: 'Run...', icon: 'assets/icons/Run.png' },
  ]);
}
