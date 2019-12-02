import { Component, OnInit, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { FleetPlacingService } from '../../services/fleet-placing.service';

@Component({
  selector: 'app-player-b',
  templateUrl: './player-b.component.html',
  styleUrls: ['./player-b.component.css']
})
export class PlayerBComponent implements OnInit, AfterViewInit {

  // Mija, ayudame después a entender cómo usar el ViewChild porfa. 
  // Estoy abrumada yo creo que por contingencia y no ando bien mentalmente
  @ViewChild('pbboard', { static: false }) plBBoard: ElementRef;
  permissionToRender = false;
  settedRows: number;
  playerBBoard = [];
  withCookie = false;

  constructor(private fleetPlacingS: FleetPlacingService) {
    // this.fleetPlacingS.choosePlayerB(); 
    this.fleetPlacingS.retrieveBoardPlayerB().subscribe(whatComes => {
      this.playerBBoard = whatComes;
      console.log('this is playerBBoard now: ', this.playerBBoard);
      this.permissionToRender = true;

    });
  }

  ngOnInit() {
    this.settedRows = this.fleetPlacingS.limiTheRows();
  }

  ngAfterViewInit() {}



}
