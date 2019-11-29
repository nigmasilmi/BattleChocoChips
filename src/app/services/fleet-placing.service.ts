import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FleetPlacingService {

  board = {};

// reactive form construction
preferencesForm = new FormGroup({
  playerName: new FormControl(''),
  colsInput: new FormControl(''),
  rowsInput: new FormControl(''),

});



  constructor(private afs: AngularFirestore) { }

  createBoard(rows: number, columns: number, playerName: string) {
    // create a 2d array that represents the player board with the number of c and r as arguments
    // this.board = Array(rows).fill(Array(columns));
    // tslint:disable-next-line: prefer-for-of
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
    // llamar a función para guardar en firestore
    const dataToSave = {board: this.board, player: playerName };
    this.saveBoardInFirestore(dataToSave);
  }


  // fuction that assigns 1 or 0 1 for placing cookie, 0 for not placing it
  placeCookieOrNot() {
    const numberA = Math.random();
    const numberB = Math.random();
    if (numberA > numberB) {
      return 0;
    } else {
      return 1;
    }
  }

  saveBoardInFirestore(data) {
    return new Promise<any>((resolve, reject) => {
      this.afs
        .collection('boards')
        .add(data)
        .then(res => {
          { }
          console.log('esto es el resolve de la promesa en saveBoardInFirestore: ', res);
        },
          err => reject(err));
    });
  }

}
