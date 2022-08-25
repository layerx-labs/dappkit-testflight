import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomModelComponent } from './custom-model.component';

describe('ModuleLoadComponent', () => {
  let component: CustomModelComponent;
  let fixture: ComponentFixture<CustomModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
