import { Component, OnInit } from '@angular/core';
import { FleetPlacingService } from 'src/app/services/fleet-placing.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  permissionToRender: boolean;
  iGoWithA: boolean;
  iGoWithB: boolean;
  playerName: string;
  colsInput: number;
  rowsInput: number;
  playerIsSet = false;
  boardsPredefined: any;
  availableList: any;

  constructor(public fleetPlacingS: FleetPlacingService) {
    this.fleetPlacingS.pushBoardsCollection();
    this.boardsPredefined = this.fleetPlacingS.getPredefinedBoards();
    this.fleetPlacingS.bringTheAvailables().subscribe(whatComes => {
      this.availableList = whatComes;
      console.log(this.availableList);
      this.permissionToRender = true;

    });
  }

  ngOnInit() {
  }

  // fuction to select the player and display player options
  goWithA() {
    this.iGoWithB = false;
    this.iGoWithA = true;
  }

  goWithB() {
    this.iGoWithB = true;
    this.iGoWithA = false;
  }


  // get inputs to validate them -- Player A -- check if later on this functionality must be moved or not
  get playerNameInput() {
    return this.fleetPlacingS.preferencesForm.get('playerName');
  }

  get colsNumber() {
    return this.fleetPlacingS.preferencesForm.get('colsInput');
  }

  get rowsNumber() {
    return this.fleetPlacingS.preferencesForm.get('rowsInput');
  }

  showTheBoardsOption() {
    return this.fleetPlacingS.getPredefinedBoards();

  }

  onSubmit() {
    const playerNameToPass = this.fleetPlacingS.preferencesForm.value.playerName;
    let rowsInputToPass: number;
    let colsInputToPass: number;
    const boardSelected = this.fleetPlacingS.preferencesForm.value.boardType;
    switch (boardSelected) {
      case '5x5':
        rowsInputToPass = 5;
        colsInputToPass = 5;
        break;
      case '7x7':
        rowsInputToPass = 7;
        colsInputToPass = 7;
        break;

      case '10x10':
        rowsInputToPass = 10;
        colsInputToPass = 10;
        break;
    }
    this.fleetPlacingS.createBoard(rowsInputToPass, colsInputToPass, playerNameToPass);
    this.playerIsSet = true;
    this.fleetPlacingS.preferencesForm.reset();

    // aquí hay que viajar a la ruta del tablero recién creado --battlefield/boarA/[id del tablero]--
    // para que se active la funcionalidad
    // y lo muestre como hijo del componente battlefield
    // cómo obtengo el id recién creado?
    // retornando el id en la función de guardar en firebase, en la res de la promesa
    // y asignándolo a una variable en este componente



  }


}
