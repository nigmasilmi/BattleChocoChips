import { Component, OnInit } from '@angular/core';
import { FleetPlacingService } from '../../services/fleet-placing.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-player-a',
  templateUrl: './player-a.component.html',
  styleUrls: ['./player-a.component.css']
})
export class PlayerAComponent implements OnInit {

  objectKeys = Object.keys;
  loading = false;
  settedRows: number;
  currentId: string;
  currentRoute: string;
  boardLanding: any;
  gameStarted = false;
  alreadyStartedMsg = false;
  btnAppear = true;
  noMoreCookies: boolean;


  constructor(private route: ActivatedRoute, public fleetPlacingS: FleetPlacingService) {
  }

  ngOnInit() {
    this.settedRows = this.fleetPlacingS.limiTheRows();
    this.route.paramMap.subscribe(params => this.currentId = params.get('id'));
    this.fleetPlacingS.bringTheInterestBoard(this.currentId).snapshotChanges().subscribe(boardComing => {
      this.boardLanding = boardComing.payload.data();
      this.settedRows = this.boardLanding.nRows;
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

  cookieToggler(id, coords, containsCookie, isHitted, isEaten, slotId) {
    console.log('la casilla pulsada tiene: ', id, coords, containsCookie, isHitted, isEaten);
    if (this.gameStarted === false) {
      this.fleetPlacingS.toogleTheCookie(id, coords, containsCookie, isHitted, isEaten);
    } else {
      this.startedMsg();
      this.cookieOrJellyMarked(id, coords, containsCookie, isHitted, isEaten, slotId);
    }

    this.whoIsClicking(id);
  }

  // function that identifies the player clicking
  whoIsClicking(id: string) {
    console.log('el que está haciendo click es:', id);
    return id;
    // debe ejecutarse en un click de cada celda
    // debe tomar el id del tablero
    // debe tomar el componente en el que se está ejecutando el click
    // debe tomar al objeto board y extraer las propiedades anfitrion e invitado
    // crear un arreglo local y temporal para ello? si
  }

  startGame() {
    this.gameStarted = true;
    this.btnAppear = false;
    this.noMoreCookies = false;
  }

  startedMsg() {
    this.alreadyStartedMsg = true;
    setTimeout(() => {
      this.alreadyStartedMsg = false;
    }, 3000);
  }

  cookieOrJellyMarked(id, coords, containsCookie, isHitted, isEaten, slotId) {
    if (containsCookie === 0) {
      // cambiar estilo al slot con el id especificado
      (document.querySelector('#' +
      this.fleetPlacingS.thereIsCookieOrJelly(id, coords, containsCookie, isHitted, isEaten, slotId)) as HTMLElement)
      .style.background = 'green';
    } else if (containsCookie === 1) {
      (document.querySelector('#' +
      this.fleetPlacingS.thereIsCookieOrJelly(id, coords, containsCookie, isHitted, isEaten, slotId)) as HTMLElement)
      .style.background = 'red';
    }
  }


}
