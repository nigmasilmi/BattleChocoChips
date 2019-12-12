import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FleetPlacingService } from './fleet-placing.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Board } from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  playerBId: string;
  hostBoard: any;
  hostName: string;
  hostId: string;
  hostColsRows: number;
  allowTheseCookies: number;
  guestCols: number;
  guestRows: number;
  guestBoard = {};
  localGuestBoard = {};
  guestForm = new FormGroup({
    guestName: new FormControl('', [Validators.required]),
  });

  constructor(public afs: AngularFirestore, public fleetService: FleetPlacingService) { }


  setTheRules(hostId: string, guestName: string) {
    // tomar el id del tablero anfitrión -- extraerlo de la ruta (ocurre en el componente player-b)
    // encontrar la propiedad de filas o columnas
    const boardChanges = this.fleetService.bringTheInterestBoard(hostId);
    const id = hostId;
    this.hostId = hostId;
    boardChanges.snapshotChanges().subscribe(changes => {
      const boardLanding = changes.payload.data() as Board;
      this.hostBoard = boardLanding.board;
      this.hostName = boardLanding.player;

    });
    let hostColsAndRows: number;
    boardChanges.get().pipe().forEach(element => {
      hostColsAndRows = element.data().nCols;
      console.log('console.log(element.data().nCols:', (element.data().nCols));
      this.createGuestBoard(hostColsAndRows, guestName, id);
    });

  }


  updateTheHostBoard(id: string, guestName: string, gtId: string) {
    this.afs.collection('boards').doc(`${id}`).update({ guest: guestName, guestId: gtId });

  }


  createGuestBoard(rowsAndColumns: number, guestName: string, hId: string) {
    const cookiesAllowed = Math.floor(rowsAndColumns * rowsAndColumns * 0.3);
    // tslint:disable-next-line: prefer-for-of
    for (let r = 0; r < rowsAndColumns; r++) {
      this.guestBoard[r] = [];
      for (let c = 0; c < rowsAndColumns; c++) {
        this.guestBoard[r][c] = {
          coordinates: `${r}${c}`,
          withCookie: this.fleetService.placeCookieOrNot(this.fleetService.cookieCounter),
          hitted: 0,
          eaten: 0
        };
      }
    }
    // save the localBoard
    this.localGuestBoard = this.guestBoard;
    // prepare the data to save in firestore
    const dataToSave = {
      board: this.guestBoard,
      player: guestName,
      host: this.hostName,
      hostId: hId,
      guest: 'IamTheGuest',
      nRows: rowsAndColumns,
      nCols: rowsAndColumns,
      fleetNumber: cookiesAllowed
    };

    // saves in firestore
    return new Promise<any>((resolve, reject) => {
      let playerBId = '';
      this.afs
        .collection('boards')
        .add(dataToSave)
        .then(res => {
          res.get().then(resp => {
            console.log('resDelaPromesa para el player B: ', resp.data());
            playerBId = resp.id;
            console.log('playerBId: ', playerBId);
            this.playerBId = playerBId;
            // update the host board including the guest id
            // this.updateTheHostBoard(this.hostId, guestName, playerBId);
            this.updateTheHostBoard(this.hostId, guestName, playerBId);
          });
        },
          err => reject(err));
    });
  }

  gimmeThePlayerBId() {
    console.log('this.playerBId: ', this.playerBId);
    return this.playerBId;
  }

  keepCookiesConstantInB() {
    this.fleetService.keepCookiesConstant();
  }

bringTheOpponentBoard() {
  const id = this.gimmeThePlayerBId();
  console.log('id in bringTheOpponentBoard: ', id);
  this.afs.collection('boards').doc(id).snapshotChanges().subscribe(boardComing => {
    const boardLanding = boardComing.payload.data() as Board;
    this.localGuestBoard = boardLanding.board;
    this.guestCols = boardLanding.nCols;
    this.guestRows = boardLanding.nRows;
    this.allowTheseCookies = boardLanding.fleetNumber;

  });
  return this.afs.collection('boards').doc(id);
}

togleBCookies(id, coords, containsCookie, isHitted, isEaten) {
  this.fleetService.toogleTheCookie(id, coords, containsCookie, isHitted, isEaten);
}

thereIsCookieOrJellyB(id, coords, containsCookie, isHitted, isEaten, slotId) {
  this.fleetService.thereIsCookieOrJelly(id, coords, containsCookie, isHitted, isEaten, slotId);
}

// function that stores the battle contenders id and their object properties




}
