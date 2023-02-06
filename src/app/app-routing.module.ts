import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameResultsComponent } from './game-results/game-results.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: "results/:teamAbbr", component: GameResultsComponent
  },
  { path: 'GameResults', loadChildren: () => import('./game-results/game-results.module')
    .then(m => m.GameResultsModule) },
  {
    path: "**", component: GameStatsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
