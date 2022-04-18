import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbiMethodsComponent } from './abi-methods.component';

describe('AbiMethodsComponent', () => {
  let component: AbiMethodsComponent;
  let fixture: ComponentFixture<AbiMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbiMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbiMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
