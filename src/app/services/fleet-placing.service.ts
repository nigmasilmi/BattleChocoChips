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
  localBoard: any;
  actualPlayer = '';
  oponentPlayer = '';
  settedRows: number;
  settedColumns: number;
  // reactive form construction
  preferencesForm = new FormGroup({
    playerName: new FormControl(''),
    colsInput: new FormControl(''),
    rowsInput: new FormControl(''),

  });


  constructor(private afs: AngularFirestore) { }


  // Sugerencia de diseño para testeo:
  //      createBoard() retorne dataToSave{}
  //      desde el lugar donde se llama a createBoard() se debería pasar a la
  //       función saveBoardInFiresore() el objeto correspondiente.
  createBoard(rows: number, columns: number, playerName: string) {
    // create a 2d array that represents the player board with the number of c and r as arguments
    // tslint:disable-next-line: prefer-for-of
    this.settedRows = rows;
    this.settedColumns = columns;
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
    // save the localBoard
    this.localBoard = this.board;
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

  // RETRIEVE BOARD (based on player B)
  // must search a player different to player A

  // retrieveBoardPlayerB() {
  //   const targetPlayer = this.oponentPlayer;
  //   return this.afs.collection(
  //     'boards', ref => ref.where('player', '==', `${targetPlayer}`))
  //     .snapshotChanges().pipe(map(changes => {
  //       return changes.map(a => {
  //         const boarDataComing = a.payload.doc.data() as Board;
  //         console.log('esto es boarDataComing: ', boarDataComing);
  //         boarDataComing.id = a.payload.doc.id;
  //         const boarData = [];
  //         for (const obj in boarDataComing.board) {
  //           if (obj) {
  //             boarData.push(boarDataComing.board[obj]);
  //           }
  //         }
  //         boarDataComing.board = boarData;
  //         console.log('boarDataComing.board:', boarDataComing.board);
  //         console.log('boarData:', boarData);
  //         return boarDataComing;
  //       });
  //     }));
  // }


  // Por algún motivo hermoso y desconocido, dejo de funcionar.
  // choosePlayerB() {
  //   console.log('===== PLAYER B =====');
  //   // Obtener datos de collection para elegir un jugador B
  //   const targetPlayer = this.actualPlayer;
  //   // lo que sigue me funcionaba durante el día, pero después de volver
  //   // de ensayo ahora sólo me muestra un elemento de la colección guardada
  //   // en firebase y no sé por qué =_=
  //   // en lugar de guardar todos los elementos de la colección en boardsCollection,
  //   // guarda solo uno
  //   this.afs.collection('boards').snapshotChanges().subscribe((querySnapshot) => {
  //     let boardsCollection = [];
  //     console.log('querySnapshot.forEach');
      
  //     querySnapshot.forEach((doc) => {
  //       console.log(doc);
        
  //       boardsCollection.push({
  //         id: doc.payload.doc.id,
  //         data: doc.payload.doc.data
  //       });
  //     });
  //     console.log('boardsCollection.length: ',boardsCollection.length);
      
  //     boardsCollection.forEach((element) => {
  //       console.log(element.id, ' ', element.data);
  //     })

  //     // elegir un número al azar entre 0 y el largo del arreglo local
  //     const rndNumber = this.randomNumber(boardsCollection.length);
  //     console.log('randomNumber: ', rndNumber);
  //     // ver al jugador al que le corresponde el número
  //     console.log(boardsCollection[rndNumber[0]]);
  //     console.log('nombre jugador ', rndNumber, ' ', boardsCollection[rndNumber[0]].data.player);
  //     // si el jugador es el actual, elegir otro número
  //     for(let i = 0; i < rndNumber.length; i++) {
  //       if (boardsCollection[rndNumber[i]].data.player != targetPlayer ) {
  //         this.oponentPlayer = boardsCollection[rndNumber[i]].data.player;
  //         break;
  //       }
  //     }
  //     console.log(this.oponentPlayer);
  //   });

  // }

  // Si lo usamos, debería estar en otro servicio
  randomNumber(range: number) { // retorna array de números del 0 al rango indicado en orden azaroso
    console.log('range: ', range);
    
    let numbers = [];
    for(let i = 0; i < range; i++) {
      numbers.push(i);
      i++;
    }
    console.log('numbers: ', numbers);
    
    return this.shuffle(numbers);
  }

  // Si lo usamos, debería estar en otro servicio
  shuffle(array) {
    for(let j, x, i = array.length; i; j = (Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
  };

  // stablishes the limit to render each row in the board grid
  limiTheRows() {
    return this.settedRows;
  }


  // extracts the coordinates depending on the number of rows x cols
  checkTheCoordLength(targetCoords) {
    const coords = [];
    const coordLength = targetCoords.toString().length;
    console.log('targetCoords: ', targetCoords);
    console.log('coordLength: ', coordLength);
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

    for (let r = 0; r < this.settedRows; r++) {
      // this.localBoard[r] = [];
      for (let c = 0; c < this.settedColumns; c++) {
        if (this.localBoard[r][c] === this.localBoard[rowCoord][colCoord]) {
          if (contCookieComing === 0) {
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
    return this.afs.collection('boards').doc(`${idComing}`).update({ board: this.localBoard} );
  }

}
