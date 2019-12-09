import { Component, OnInit } from '@angular/core';
import { BattleService } from '../../services/battle.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-player-b',
  templateUrl: './player-b.component.html',
  styleUrls: ['./player-b.component.css']
})
export class PlayerBComponent implements OnInit {
  objectKeys = Object.keys;
  currentId: string;
  loading: boolean;
  btnAppear = true;
  gameStarted = false;
  noMoreCookies: boolean;

  constructor(private route: ActivatedRoute, public battleServ: BattleService) { }


  ngOnInit() {
    this.route.firstChild.paramMap.subscribe(params => this.currentId = params.get('id'));
  }


  getGuestName() {
    const guestName = this.battleServ.guestForm.value.guestName;
    return guestName;
  }

  createGuestBoard() {
    const guestName = this.getGuestName();
    this.battleServ.setTheRules(this.currentId, guestName);
    this.battleServ.guestForm.reset();
    this.loading = true;

  }

  keepCookiesConstant() {
    this.battleServ.keepCookiesConstantInB();
  }

  startGame() {
    this.gameStarted = true;
    this.btnAppear = false;
    this.noMoreCookies = false;
  }
}
