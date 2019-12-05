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
  {path: '',
  component: GameBoardComponent,
  children: [ /* Nested Routes es el concepto que hay que averiguar */
    {path: 'boardA', component: PlayerAComponent /*, outlet: 'playerBoardA'*/},
    {path: 'boardB', component: PlayerBComponent, outlet: 'playerBoardB'}
  ]}
  // {path: 'boardA', component: PlayerAComponent, outlet: 'playerBoardA'},
  // {path: 'boardB', component: PlayerBComponent, outlet: 'playerBoardB'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
