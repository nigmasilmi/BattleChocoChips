import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Board } from '../models/board';


@Injectable({
  providedIn: 'root'
})
export class FleetPlacingService {

  board = {};
  actualPlayer = '';
  settedRows: number;
  // reactive form construction
  preferencesForm = new FormGroup({
    playerName: new FormControl(''),
    colsInput: new FormControl(''),
    rowsInput: new FormControl(''),

  });



  constructor(private afs: AngularFirestore) { }

  createBoard(rows: number, columns: number, playerName: string) {
    // create a 2d array that represents the player board with the number of c and r as arguments
    // tslint:disable-next-line: prefer-for-of
    this.settedRows = rows;
    for (let r = 0; r < rows; r++) {
      this.board[r] = [];
      for (let c = 0; c < columns; c++) {
        this.board[r][c] = {
          coordinates: `${r}${c}`,
          withCookie: this.placeCookieOrNot(),
          hitted: 0,
          eaten: 0
        };
      }

    }
    // saves in firestore
    const dataToSave = { board: this.board, player: playerName };
    this.saveBoardInFirestore(dataToSave);
  }


  // fuction that assigns 1 or 0,  1 for placing cookie, 0 for not placing it
  placeCookieOrNot() {
    const numberA = Math.random();
    const numberB = Math.random();
    if (numberA > numberB) {
      return 0;
    } else {
      return 1;
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
          console.log('esto es boarDataComing: ', boarDataComing);
          boarDataComing.id = a.payload.doc.id;
          const boarData = [];
          for (const obj in boarDataComing.board) {
            if (obj) {
              boarData.push(boarDataComing.board[obj]);
            }
          }
          boarDataComing.board = boarData;
          console.log('boarDataComing.board:', boarDataComing.board);
          console.log('boarData:', boarData);
          return boarDataComing;
        });
      }));
  }

  // stablishes the limit to render each row in the board grid
  limiTheRows() {
    return this.settedRows;
  }


  checkTheCoordLength(targetCoords) {
    const coords = [];
    const coordLength = targetCoords.lenght;
    if (coordLength > 2) {
      coords[0] = +coordLength.toString().slice(0, 2);
      coords[1] = +coordLength.toString().slice(2);
    } else {
      coords[0] = +coordLength.toString().slice(0, 1);
      coords[1] = +coordLength.toString().slice(1);
    }
    return coords;

  }
  // switches from with-cookie to without-cookie and viceversa
  // updates the values in firestore
  toogleTheCookie(idComing, targetCoords, contCookieComing) {
    const rowCoord = this.checkTheCoordLength(targetCoords)[0];
    const colCoord = this.checkTheCoordLength(targetCoords)[1];
    console.log('idComing: ', idComing);
    console.log('targetCoords: ', targetCoords);
    console.log('contCookieComing: ', contCookieComing);
    // if (contCookieComing === 0) {
    //   const data = {
    //     board : {
    //       [rowCoord] : { `${colCoord}.withCookie`: 1},
    //     },
    //   };
    //   return this.afs.collection('boards').doc(`${idComing}`).update({ data });
    //   // change the value of the target
      // fetch the document with the id
      // find the coordinate
      // substitute de property's value
    // }
  }

}


