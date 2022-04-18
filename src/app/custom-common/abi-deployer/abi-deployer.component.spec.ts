import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbiDeployerComponent } from './abi-deployer.component';

describe('AbiDeployerComponent', () => {
  let component: AbiDeployerComponent;
  let fixture: ComponentFixture<AbiDeployerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbiDeployerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbiDeployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
