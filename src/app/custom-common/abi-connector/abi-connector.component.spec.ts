import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbiConnectorComponent } from './abi-connector.component';

describe('AbiConnectorComponent', () => {
  let component: AbiConnectorComponent;
  let fixture: ComponentFixture<AbiConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbiConnectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbiConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
