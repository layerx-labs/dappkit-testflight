import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionLogComponent } from './connection-log.component';

describe('AbiConnectorLogComponent', () => {
  let component: ConnectionLogComponent;
  let fixture: ComponentFixture<ConnectionLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
