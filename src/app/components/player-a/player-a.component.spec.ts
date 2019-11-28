import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAComponent } from './player-a.component';

describe('PlayerAComponent', () => {
  let component: PlayerAComponent;
  let fixture: ComponentFixture<PlayerAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
