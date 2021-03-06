import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Board } from '../../models/board';
import { Location } from '@angular/common';
import { FleetPlacingService } from '../../services/fleet-placing.service';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.css']
})
export class BattlefieldComponent implements OnInit {
  objectKeys = Object.keys;
  loading = false;
  settedRows: number;
  currentId: any;
  currentRoute: string;
  boardLanding: any;
  gameStarted = false;
  alreadyStartedMsg = false;
  btnAppear = true;
  noMoreCookies: boolean;

  constructor(private route: ActivatedRoute, public fleetPlacingS: FleetPlacingService, private location: Location) { }

  ngOnInit() {
    this.route.firstChild.paramMap.subscribe(params => this.currentId = params.get('id'));
    this.fleetPlacingS.bringTheInterestBoard(this.currentId).snapshotChanges().subscribe(boardComing => {
      this.boardLanding = boardComing.payload.data() as Board;
      this.loading = true;
    });

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
    console.log('la casilla pulsada tiene: ', id, coords, containsCookie, isHitted, isEaten );
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
