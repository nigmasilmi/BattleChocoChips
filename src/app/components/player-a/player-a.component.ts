import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FleetPlacingService } from '../../services/fleet-placing.service';

@Component({
  selector: 'app-player-a',
  templateUrl: './player-a.component.html',
  styleUrls: ['./player-a.component.css']
})
export class PlayerAComponent implements OnInit, AfterViewInit {

  @ViewChild('paboard', { static: false }) plABoard: ElementRef;
  permissionToRender = false;
  settedRows: number;
  playerABoard = [];
  withCookie = false;
  // nombre, colInput y rowInput debe ser ingresado por el usuario. Verificar que los contrincantes tengan
  // las mismas condiciones de batalla (mismo tamaño de boards)

  constructor(private fleetPlacingS: FleetPlacingService) {
    this.fleetPlacingS.retrieveBoard().subscribe(whatComes => {
      this.playerABoard = whatComes;
      console.log('this is playerABoard now: ', this.playerABoard);
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

  cookieToggler(id, coords, containsCookie, isHitted, isEaten) {
    this.fleetPlacingS.toogleTheCookie(id, coords, containsCookie, isHitted, isEaten);
  }


}
