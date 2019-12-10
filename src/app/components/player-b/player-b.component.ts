import { Component, OnInit } from '@angular/core';
import { BattleService } from '../../services/battle.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-player-b',
  templateUrl: './player-b.component.html',
  styleUrls: ['./player-b.component.css']
})
export class PlayerBComponent implements OnInit {
  objectKeys = Object.keys;
  boardLanding: any;
  currentId: string;
  loading = false;
  btnAppear = false;
  gameStarted = false;
  showForm = true;
  noMoreCookies: boolean;
  settedRows: number;
  playerBId: string;
  private oppBoardCreated = new BehaviorSubject<boolean>(false);
  permission: Observable<boolean> = this.oppBoardCreated.asObservable();

  constructor(private route: ActivatedRoute, public battleServ: BattleService) {

  }


  ngOnInit() {
    this.route.firstChild.paramMap.subscribe(params => this.currentId = params.get('id'));
    this.oppBoardCreated.subscribe(data => {
      if (data) {
        this.loading = true;
      }
    });

  }


  getGuestName() {
    const guestName = this.battleServ.guestForm.value.guestName;
    return guestName;
  }

  createGuestBoard() {
    const guestName = this.getGuestName();
    this.battleServ.setTheRules(this.currentId, guestName);
    this.battleServ.guestForm.reset();

  }

  keepCookiesConstant() {
    this.battleServ.keepCookiesConstantInB();
  }

  startGame() {
    this.gameStarted = true;
    this.btnAppear = false;
    this.noMoreCookies = false;
  }

  showTheOpponentBoard() {
    this.battleServ.bringTheOpponentBoard().snapshotChanges().subscribe(boardComing => {
      this.boardLanding = boardComing.payload.data();
      this.settedRows = this.boardLanding.nRows;
      console.log('this.boardLanding in player b comp: ', this.boardLanding);
      this.loading = true;
      this.btnAppear = true;
      this.showForm = false;

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


}
