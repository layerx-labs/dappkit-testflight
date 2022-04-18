import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbiInteractionComponent } from './abi-interaction.component';

describe('AbiInteractionComponent', () => {
  let component: AbiInteractionComponent;
  let fixture: ComponentFixture<AbiInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbiInteractionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbiInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
