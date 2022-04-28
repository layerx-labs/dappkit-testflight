import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLoadComponent } from './module-load.component';

describe('ModuleLoadComponent', () => {
  let component: ModuleLoadComponent;
  let fixture: ComponentFixture<ModuleLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
