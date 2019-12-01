import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBComponent } from './player-b.component';

describe('PlayerBComponent', () => {
  let component: PlayerBComponent;
  let fixture: ComponentFixture<PlayerBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the oponent´s data', () => {
    
  })

});
