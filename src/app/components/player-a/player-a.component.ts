import { Component, OnInit } from '@angular/core';
import { FleetPlacingService } from '../../services/fleet-placing.service';
import { ActivatedRoute } from '@angular/router';
import { BattleService } from '../../services/battle.service';


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
  // itIsNotMyTurn: boolean;
  // nombre, colInput y rowInput debe ser ingresado por el usuario. Verificar que los contrincantes tengan
  // las mismas condiciones de batalla (mismo tamaño de boards)

  constructor(
    private route: ActivatedRoute,
    public fleetPlacingS: FleetPlacingService,
    public battleServ: BattleService
    ) { }

  ngOnInit() {
    this.settedRows = this.fleetPlacingS.limiTheRows();
    this.route.paramMap.subscribe(params => this.currentId = params.get('id'));
    this.fleetPlacingS.bringTheInterestBoard(this.currentId).snapshotChanges().subscribe(boardComing => {
      this.boardLanding = boardComing.payload.data();
      this.settedRows = this.boardLanding.nRows;
      this.loading = true;
      console.log('(1)this.boardLanding: ', this.boardLanding);
    });
    console.log('(2)this.boardLanding: ', this.boardLanding);
    this.fleetPlacingS.bringTheInterestBoard(this.currentId).get()
    .pipe().forEach(element => {
      const myBoardLanding = element.data();
      console.log('myBoardLanding: ', myBoardLanding);
      this.hideBoardContent(this.currentId, myBoardLanding);
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
      if (this.battleServ.switchTurn) {
        // this.itIsNotMyTurn = true;
      } else {
        // this.itIsNotMyTurn = false;
        this.cookieOrJellyMarked(id, coords, containsCookie, isHitted, isEaten, slotId);
        // this.battleServ.switchTurn = true;
        // this.itIsNotMyTurn = true;
      }
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

// Credits (no borrar)
// galleta quebrada
// <div>Icons made by <a href="https://www.flaticon.com/authors/freepik"
// title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"
// title="Flaticon">www.flaticon.com</a></div>

// jalea Aplastada
// <div>Icons made by <a href="https://www.flaticon.com/authors/freepik"
// title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/
// "title="Flaticon">www.flaticon.com</a></div>

  cookieOrJellyMarked(id, coords, containsCookie, isHitted, isEaten, slotId) {
    // console.log('ID SLOT: ', this.fleetPlacingS.thereIsCookieOrJelly(id, coords, containsCookie, isHitted, isEaten, slotId));
    const boardSlotId = this.fleetPlacingS.thereIsCookieOrJelly(id, coords, containsCookie, isHitted, isEaten, slotId);

    (document.querySelector('#' + boardSlotId) as HTMLElement)
    .style.backgroundRepeat = 'no-repeat';
    (document.querySelector('#' + boardSlotId) as HTMLElement)
    .style.backgroundSize = '100%';

    if (containsCookie === 0) {
      // cambiar estilo al slot con el id especificado
      (document.querySelector('#' + boardSlotId) as HTMLElement)
      .style.backgroundImage =
      'url("https://res.cloudinary.com/dcloh6s2z/image/upload/v1575983595/Portafolio/BattleChocoChip/jaleaAplastada_q5duce.png")';
    } else if (containsCookie === 1) {
      (document.querySelector('#' + boardSlotId) as HTMLElement)
      .style.backgroundImage =
      'url("https://res.cloudinary.com/dcloh6s2z/image/upload/v1575982533/Portafolio/BattleChocoChip/cookieCrumb_lbnkpx.png")';
    }
    // this.itIsNotMyTurn = true;
    // this.battleServ.switchTurn = true;
  }

  hideBoardContent(currentId, boardData) {
    console.log('hideBoardContent(boardData)');
    console.log('boardData: ', boardData);
    console.log('currentId: ', currentId);
    if (boardData.guest === 'ninguno') {
      console.log('(boardData.guest === ninguno)');
      (document.querySelectorAll('.empty').forEach(element => {
        // console.log('querySelectorAll element: ', element);
        element.setAttribute('style', 'background: aqua;');
      }) );
      (document.querySelectorAll('.ocuppied').forEach(element => {
        // console.log('querySelectorAll element: ', element);
        element.setAttribute('style', 'background: aqua;');
      }) );
    } else if (boardData.guest !== 'IamTheGuest') { // si yo soy player b, oculto player a
      console.log('boardData.hostId: ', boardData.hostId);
    } else { // si yo soy player a, oculto player b
      //
    }
  }


}
