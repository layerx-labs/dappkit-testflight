import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotConnectedOrActiveModelComponent } from './not-connected-or-active-model.component';

describe('NotConnectedOrActiveModelComponent', () => {
  let component: NotConnectedOrActiveModelComponent;
  let fixture: ComponentFixture<NotConnectedOrActiveModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotConnectedOrActiveModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConnectedOrActiveModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
