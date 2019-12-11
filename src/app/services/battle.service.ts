import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FleetPlacingService } from './fleet-placing.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Board } from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class BattleService {
  currentId: string;
  hostBoard: any;
  columnsNumber = 0;
  hostName = '';
  guestNameIs = '';
  guestBoard = {};
  localGuestBoard = {};
  guestForm = new FormGroup({
    guestName: new FormControl('', [Validators.required]),
  });
  switchTurn = false; // true le toca a B. false le toca a A.

  constructor(public afs: AngularFirestore, public fleetService: FleetPlacingService) { }


  setTheRules(hostId: string, guestName: string) {
    // tomar el id del tablero anfitrión -- extraerlo de la ruta (ocurre en el componente player-b)
    // encontrar la propiedad de filas o columnas -- hacer query del documento
    const boardChanges = this.fleetService.bringTheInterestBoard(hostId);
    const id = hostId;
    let colsAndRows: number;
    boardChanges.snapshotChanges().subscribe(changes => {
      const boardLanding = changes.payload.data() as Board;
      this.hostBoard = boardLanding.board;
    // asignarla a una propiedad de la clase
      colsAndRows = boardLanding.nCols;
      this.columnsNumber = boardLanding.nCols;
      console.log('this.columnsNumber: ', this.columnsNumber);

      this.hostName = boardLanding.player;
      this.guestNameIs = guestName;
      this.createGuestBoard(this.columnsNumber);
    });
    console.log('colsAndRows: ', colsAndRows);
    this.updateTheHostBoard(id, guestName);
    console.log('this.columnsNumber: ', this.columnsNumber);

  }

  updateTheHostBoard(id: string, guestName: string) {
   this.afs.collection('boards').doc(`${id}`).update({ guest: guestName });

  }

  createGuestBoard(rowsAndColumns: number) {
    const cookiesAllowed = Math.floor(rowsAndColumns * rowsAndColumns * 0.3);
    console.log('cookiesAllowed: ', cookiesAllowed );
    // create a 2d array that represents the player board with the number of c and r as arguments
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
    console.log('this.localGuestBoard: ', this.localGuestBoard);
    console.log('this.guestBoard: ', this.guestBoard);
    // saves in firestore
    const dataToSave = {
      board: this.guestBoard,
      player: this.hostName,
      guest: 'IamTheGuest',
      nRows: rowsAndColumns,
      nCols: rowsAndColumns,
      fleetNumber: cookiesAllowed
    };
    this.fleetService.saveBoardInFirestore(dataToSave);

  }

  keepCookiesConstantInB() {
    this.fleetService.keepCookiesConstant();
  }



}
