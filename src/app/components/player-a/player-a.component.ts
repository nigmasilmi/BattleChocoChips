import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FleetPlacingService } from '../../services/fleet-placing.service';

@Component({
  selector: 'app-player-a',
  templateUrl: './player-a.component.html',
  styleUrls: ['./player-a.component.css']
})
export class PlayerAComponent implements OnInit, AfterViewInit {

  @ViewChild('paboard', { static: false }) plABoard: ElementRef;
  // permissionToRender = false;
  permissionToRender = true;
  board = [];
  withCookie = false;
  // rowInput: number;
  // colInput: number;
  // nombre, colInput y rowInput debe ser ingresado por el usuario. Verificar que los contrincantes tengan
  // las mismas condiciones de batalla (mismo tamaño de boards)
  colInput = 4;
  rowInput = 4;
  playerName = 'cualquieraPorAhora';
  constructor(private fleetPlacingS: FleetPlacingService) { }

  ngOnInit() {
    this.fleetPlacingS.createBoard(this.rowInput, this.colInput, this.playerName);
  }

  ngAfterViewInit() {
    console.log('nothing yet');
  }
  // function that sets the styles for occupied or not depending of the boolean value at the moment
  setTheSquare() {
    const classes = {
      ocuppied: this.withCookie === true,
      empty: !this.withCookie === true
    };
    return classes;
  }
}
