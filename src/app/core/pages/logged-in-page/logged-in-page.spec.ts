import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInPage } from './logged-in-page';

describe('LoggedInPage', () => {
  let component: LoggedInPage;
  let fixture: ComponentFixture<LoggedInPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedInPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LoggedInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
