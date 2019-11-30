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
  board = [];
  playerABoard = {};
  withCookie = false;
  // nombre, colInput y rowInput debe ser ingresado por el usuario. Verificar que los contrincantes tengan
  // las mismas condiciones de batalla (mismo tamaño de boards)

  constructor(private fleetPlacingS: FleetPlacingService) {
    this.fleetPlacingS.retrieveBoard().subscribe(whatComes => {
      this.playerABoard = whatComes;
      console.log('this is whatComes: ', whatComes);
      this.permissionToRender = true;

    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {}

  // function that sets the styles for occupied or not depending of the boolean value at the moment
  setTheSquare() {
    const classes = {
      ocuppied: this.withCookie === true,
      empty: !this.withCookie === true
    };
    return classes;
  }
}
