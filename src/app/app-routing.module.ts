import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { PlayerAComponent } from './components/player-a/player-a.component';
import { PlayerBComponent } from './components/player-b/player-b.component';
import { BattlefieldComponent } from './components/battlefield/battlefield.component';


const routes: Routes = [
  {path: '', component: GameBoardComponent},
  {path: 'battlefield',
  component: BattlefieldComponent,
   children: [
     { path: 'boardA/:id', component: PlayerAComponent },
    //  { path: 'boardB/:id', component: PlayerBComponent }

    ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
