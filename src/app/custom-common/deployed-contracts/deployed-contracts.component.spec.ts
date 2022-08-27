import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployedContractsComponent } from './deployed-contracts.component';

describe('DeployedContractsComponent', () => {
  let component: DeployedContractsComponent;
  let fixture: ComponentFixture<DeployedContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployedContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
