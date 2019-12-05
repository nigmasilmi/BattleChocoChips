import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Board } from '../models/board';


@Injectable({
  providedIn: 'root'
})
export class FleetPlacingService {

  board = {};
  localBoard: any;
  actualPlayer = '';
  settedRows: number;
  settedColumns: number;
  commandToDissapear = false;
  allowTheseCookies: number;
  cookieCounter: number;
  stoPlacingTheCookie: boolean;
  boardsCollection: any = [];

  // reactive form construction
  preferencesForm = new FormGroup({
    playerName: new FormControl('', [Validators.required]),
    boardType: new FormControl([]),
    colsInput: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
    rowsInput: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),

  });


  constructor(private afs: AngularFirestore) {
    this.cookieCounter = 0;

  }

  createBoard(rows: number, columns: number, playerName: string) {
    // calculate the cookie percentage allowed for the board
    let playersInBoard = [];
    playersInBoard[0] = playerName;
    playersInBoard = this.joinTheGuest(playersInBoard, 'ninguno');
    const cookiesAllowed = Math.floor(rows * columns * 0.3);
    this.allowTheseCookies = cookiesAllowed;
    console.log(cookiesAllowed);
    // create a 2d array that represents the player board with the number of c and r as arguments
    // tslint:disable-next-line: prefer-for-of
    this.settedRows = rows;
    this.settedColumns = columns;
    for (let r = 0; r < rows; r++) {
      this.board[r] = [];
      for (let c = 0; c < columns; c++) {
        this.board[r][c] = {
          coordinates: `${r}${c}`,
          withCookie: this.placeCookieOrNot(this.cookieCounter),
          hitted: 0,
          eaten: 0
        };
      }

    }
    // save the localBoard
    this.localBoard = this.board;
    // saves in firestore
    const dataToSave = {
      board: this.board,
      player: playersInBoard[0],
      guest: playersInBoard[1],
      nRows: rows,
      nCols: columns,
      fleetNumber: this.allowTheseCookies
    };
    this.saveBoardInFirestore(dataToSave);
  }



  // fuction that assigns 1 or 0,  1 for placing cookie, 0 for not placing it
  placeCookieOrNot(cookiesAreNumbered) {
    const cookieLimit = this.allowTheseCookies;
    if (cookiesAreNumbered < cookieLimit) {
      console.log('counter: ', this.cookieCounter);
      const numberA = Math.random();
      const numberB = Math.random();
      if (numberA > numberB) {
        return 0;
      } else {
        this.cookieCounter++;
        return 1;
      }

    } else {
      return 0;
    }

  }

  // CREATE BOARD (with player name)
  saveBoardInFirestore(data) {
    return new Promise<any>((resolve, reject) => {
      this.afs
        .collection('boards')
        .add(data)
        .then(res => {
          console.log('esto es el resolve de la promesa en saveBoardInFirestore: ', res);
        },
          err => reject(err));
    });
  }

  // RETRIEVE BOARD (based on player name)
  // must validate name and id

  retrieveBoard() {
    const targetPlayer = this.actualPlayer;
    return this.afs.collection(
      'boards', ref => ref.where('player', '==', `${targetPlayer}`))
      .snapshotChanges().pipe(map(changes => {
        return changes.map(a => {
          const boarDataComing = a.payload.doc.data() as Board;
          boarDataComing.id = a.payload.doc.id;
          const boarData = [];
          for (const obj in boarDataComing.board) {
            if (obj) {
              boarData.push(boarDataComing.board[obj]);
            }
          }
          boarDataComing.board = boarData;
          return boarDataComing;
        });
      }));
  }

  pushBoardsCollection() {
    console.log('====== CHOOSE PLAYER B ======');
    // guardar en this.boardsCollection los id de todos los datos de jugadores
    this.afs.collection('boards').snapshotChanges().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc);
        this.boardsCollection.push(doc.payload.doc.id);
      });
      console.log('this.boardsCollection: ', this.boardsCollection);
    });
    return this.boardsCollection;
  }

  shuffle(array) {
    for (let j, x, i = array.length; i; j = (Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) {
      return array;
    }

  }

  choosePlayerB(IDPlayerA, IDsArray) {
    const IDsRandomOrderArray = this.shuffle(IDsArray);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < IDsRandomOrderArray.length; i++) {
      if (IDPlayerA === IDsRandomOrderArray[i]) {
        continue;
      } else {
        return IDsRandomOrderArray[i];
      }
    }
  }

  // stablishes the limit to render each row in the board grid
  limiTheRows() {
    return this.settedRows;
  }


  // extracts the coordinates depending on the number of rows x cols
  checkTheCoordLength(targetCoords) {
    const coords = [];
    const coordLength = targetCoords.toString().length;
    if (coordLength > 2) {
      coords[0] = +targetCoords.toString().slice(0, 2);
      coords[1] = +targetCoords.toString().slice(2);
    } else {
      coords[0] = +targetCoords.toString().slice(0, 1);
      coords[1] = +targetCoords.toString().slice(1);
    }
    console.log('coords: ', coords);
    return coords;

  }

  // fuction to update the local board
  // switches from with-cookie to without-cookie and viceversa
  // updates the values in firestore
  toogleTheCookie(idComing, targetCoords, contCookieComing, hittedComming, eatenComing) {
    const rowCoord = this.checkTheCoordLength(targetCoords)[0];
    const colCoord = this.checkTheCoordLength(targetCoords)[1];
    const mayIPlaceAnotherCookie = this.keepCookiesConstant();
    this.stoPlacingTheCookie = this.keepCookiesConstant();
    for (let r = 0; r < this.settedRows; r++) {
      // this.localBoard[r] = [];
      for (let c = 0; c < this.settedColumns; c++) {
        if (this.localBoard[r][c] === this.localBoard[rowCoord][colCoord]) {
          if (contCookieComing === 0 && mayIPlaceAnotherCookie) {
            this.localBoard[r][c] = {
              coordinates: `${r}${c}`,
              withCookie: 1,
              hitted: hittedComming,
              eaten: eatenComing
            };
          } else {
            this.localBoard[r][c] = {
              coordinates: `${r}${c}`,
              withCookie: 0,
              hitted: hittedComming,
              eaten: eatenComing
            };
          }
        }
      }
    }
    console.log('this.localBoard: ', this.localBoard);
    return this.afs.collection('boards').doc(`${idComing}`).update({ board: this.localBoard });
  }

  // function that keeps the max cookies number when the player rearranges them
  keepCookiesConstant() {
    let countingCookies = 0;
    // traer el número límite de cookies
    const cookiesLimit = this.allowTheseCookies;
    // iterar localBoard, contar cuantas withCookie = 1 tenemos
    // entrar a los objetos
    for (const arr in this.localBoard) {
      if (arr) {
        // entrar a los arreglos
        this.localBoard[arr].forEach(obj => {
          // entrar a los objetos
          if (obj.withCookie === 1) {
            countingCookies++;
          }
        });
      }
    }
    // verificar si la cantidad de cookies presente supera al límite
    if (countingCookies >= cookiesLimit) {
      // dar señal para mostrar mensaje
      return false;
    } else {
      return true;
    }
  }

  getPredefinedBoards() {
    return [
      { label: '5x5', nivel: 'Principiante' },
      { label: '7x7', nivel: 'Intermedio' },
      { label: '10x10', nivel: 'Pro' },
    ];
  }

  joinTheGuest(playersPresent: Array<string>, guest: string) {
    if (playersPresent[0]) {
      if (playersPresent[1]) {
        console.log('ya hay dos jugadores acá');
      } else {
        playersPresent[1] = guest;
      }
    }

    return playersPresent;
  }


  // fuction that queries for the available boards
  // meaning: those that have 'ninguno' as guest
  bringTheAvailables() {
    return this.afs.collection(
      'boards', ref => ref.where('guest', '==', 'ninguno'))
      .snapshotChanges().pipe(map(changes => {
        return changes.map(a => {
          const boarDataComing = a.payload.doc.data() as Board;
          boarDataComing.id = a.payload.doc.id;
          const boarData = [];
          for (const obj in boarDataComing.board) {
            if (obj) {
              boarData.push(boarDataComing.board[obj]);
            }
          }
          boarDataComing.board = boarData;
          return boarDataComing;
        });
      }));
  }

  bringTheInterestBoard(id) {
    this.afs.collection('boards').doc(id).snapshotChanges().subscribe(boardComing => {
      const boardLanding = boardComing.payload.data() as Board;
      this.localBoard = boardLanding.board;
      this.settedColumns = boardLanding.nCols;
      this.settedRows = boardLanding.nRows;
      this.allowTheseCookies = boardLanding.fleetNumber;

    });
    return this.afs.collection('boards').doc(id);

  }

}
