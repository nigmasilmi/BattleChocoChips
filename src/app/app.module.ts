import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerAComponent } from './components/player-a/player-a.component';
import { PlayerBComponent } from './components/player-b/player-b.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { BattlefieldComponent } from './components/battlefield/battlefield.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerAComponent,
    PlayerBComponent,
    GameBoardComponent,
    BattlefieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
