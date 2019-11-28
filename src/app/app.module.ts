import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerAComponent } from './components/player-a/player-a.component';
import { PlayerBComponent } from './components/player-b/player-b.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerAComponent,
    PlayerBComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
