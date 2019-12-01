import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FleetPlacingService } from '../../services/fleet-placing.service';


@Component({
  selector: 'app-player-b',
  templateUrl: './player-b.component.html',
  styleUrls: ['./player-b.component.css']
})
export class PlayerBComponent implements OnInit, AfterViewInit {

  @ViewChild('paboard', { static: false }) plABoard: ElementRef;
  permissionToRender = false;
  settedRows: number;
  playerBBoard = [];
  withCookie = false;

  constructor(private fleetPlacingS: FleetPlacingService) {
    this.fleetPlacingS.retrieveBoard().subscribe(whatComes => {
      this.playerBBoard = whatComes;
      console.log('this is playerABoard now: ', this.playerBBoard);
      this.permissionToRender = true;

    });
  }

  ngOnInit() {
    this.settedRows = this.fleetPlacingS.limiTheRows();

  }

  ngAfterViewInit() {}

  // function that sets the styles for occupied or not depending of the boolean value at the moment
  setTheSquare(isThereACookie) {
    const classes = {
      ocuppied: isThereACookie === 1,
      empty: isThereACookie === 0
    };
    return classes;
  }

  cookieToggler(id, coords, containsCookie) {
    this.fleetPlacingS.toogleTheCookie(id, coords, containsCookie);
  }


}


