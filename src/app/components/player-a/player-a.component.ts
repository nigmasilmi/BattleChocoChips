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
  gameStarted = false;
  alreadyStartedMsg = false;
  btnAppear = true;
  noMoreCookies: boolean;
  // nombre, colInput y rowInput debe ser ingresado por el usuario. Verificar que los contrincantes tengan
  // las mismas condiciones de batalla (mismo tamaño de boards)

  constructor(public fleetPlacingS: FleetPlacingService) {
    this.fleetPlacingS.retrieveBoard().subscribe(whatComes => {
      this.playerABoard = whatComes;
      this.permissionToRender = true;

    });

  }

  ngOnInit() {
    this.settedRows = this.fleetPlacingS.limiTheRows();


  }

  ngAfterViewInit() {

  }

  // function that sets the styles for occupied or not depending of the boolean value at the moment
  setTheSquare(isThereACookie) {
    const classes = {
      ocuppied: isThereACookie === 1,
      empty: isThereACookie === 0
    };
    return classes;
  }

  cookieToggler(id, coords, containsCookie, isHitted, isEaten) {
    if (this.gameStarted === false) {
      this.fleetPlacingS.toogleTheCookie(id, coords, containsCookie, isHitted, isEaten);
    } else {
      this.alreadyStartedMsg = true;
      setTimeout(() => {
        this.alreadyStartedMsg = false;
      }, 3000);
    }
  }

  startGame() {
    this.gameStarted = true;
    this.btnAppear = false;
    this.noMoreCookies = false;
  }


}
