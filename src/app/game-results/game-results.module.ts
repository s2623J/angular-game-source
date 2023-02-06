import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameResultsRoutingModule } from './game-results-routing.module';
import { GameResultsComponent } from './game-results.component';


@NgModule({
  declarations: [
    GameResultsComponent
  ],
  imports: [
    CommonModule,
    GameResultsRoutingModule
  ]
})
export class GameResultsModule { }
