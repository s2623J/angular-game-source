import {Component, ContentChild, ElementRef, Input, OnInit} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {NbaService} from '../nba.service';
import {Game, Stats, Team} from '../data.models';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit {

  /** Refers back to projected content in parent (GameStatsComponent) */
  @ContentChild('daysHistory') selectDaysHistory!: ElementRef;

  @Input()
  team!: Team;
  games$!: Observable<Game[]>;
  stats!: Stats;
  daysHistory: number = 12;
  oldDaysHistory: number = 12;
  teamsArr: Team[] = [];
  
  constructor(protected nbaService: NbaService) { }

  ngOnInit(): void {
    this.render(6);
  }

  /**
   * Monitors changes that occur in parent's projected 
   * content (GameStatsComponent)
   */
  ngAfterContentChecked() {
    if (typeof(this.selectDaysHistory) !== 'undefined') {
      let selectedVals = this.selectDaysHistory.nativeElement.value.split(' ');
      this.daysHistory = Number(selectedVals[0]);
      if (this.daysHistory !== this.oldDaysHistory) {
        this.oldDaysHistory = this.daysHistory;
        this.render(this.daysHistory);
      }
    }
  }

  /**
   * Renders component
   * @param daysHistory 
   */
  render(daysHistory: number) {
    this.teamsArr.push(this.team);
    this.games$ = this.nbaService.getLastResults(this.team, daysHistory).pipe(
      tap(games =>  this.stats = this.nbaService.getStatsFromGames(games, this.team))
    )
  }
}