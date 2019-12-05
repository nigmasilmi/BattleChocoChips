import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { PlayerAComponent } from './components/player-a/player-a.component';
import { PlayerBComponent } from './components/player-b/player-b.component';
import { BattlefieldComponent } from './components/battlefield/battlefield.component';


const routes: Routes = [
  {path: '', component: GameBoardComponent},
  {path: 'boardA', component: PlayerAComponent},
  {path: 'boardB', component: PlayerBComponent},
  {path: 'battlefield/:id', component: BattlefieldComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
