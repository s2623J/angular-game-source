import { Component, ElementRef, ViewChild } from '@angular/core';
import {Team} from '../data.models';
import {Observable, tap, of, Subject} from 'rxjs';
import {NbaService} from '../nba.service';
import { TeamStatsComponent } from '../team-stats/team-stats.component';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent {
  showPopup = false;
  teams$: Observable<Team[]>;
  conferences: string[] = [];
  divisions: string[] = [];
  allTeams: Team[] = [];
  selectedTeam?: Team;
  selectedValue: string = '12 ';

  @ViewChild('teamStats') stats!: ElementRef;

  constructor(protected nbaService: NbaService) {
    this.teams$ = nbaService.getAllTeams().pipe(
      tap(data => {
        data.map( item => {
          if (!this.conferences.includes(item.conference + ' Conference')) {
            this.conferences.push(item.conference + ' Conference')}
          if (!this.divisions.includes(item.division + ' Division')) {
            this.divisions.push(item.division + ' Division')}
        })
      }),
      tap(data => this.allTeams = data)
    )
  }

  trackTeam(teamId: string, filteredForm: HTMLFormElement): void {
    const formChildren = filteredForm.children;
    const selectArr = [formChildren[0], formChildren[1], formChildren[2]];
    const divSelect = selectArr[1] as HTMLSelectElement;

    let team = this.allTeams.find(team => team.id == Number(teamId));
    if (team) this.nbaService.addTrackedTeam(team);
    if (divSelect.value === '') {
      divSelect.options[0].selected = true;
    }
  }

  filterTeams(selectBox: HTMLSelectElement, filteredForm: HTMLFormElement) {
    const formChildren = filteredForm.children;
    const selectArr = [formChildren[0], formChildren[1], formChildren[2]];
    const filterString: string = selectBox.value as string;
    const titleString: string = selectBox.innerText.split('\n')[0] as string;
    const divSelect: HTMLSelectElement = selectArr[1] as HTMLSelectElement;
    const teamSelect: HTMLSelectElement = selectArr[2] as HTMLSelectElement;
    let result: Team[] = [...this.allTeams];

    if (titleString === 'Filter By Conference') {
      result = result.filter((item: Team) => {
        return item.conference === filterString.split(' ')[0]
      })

      this.divisions = [];
      result.map((item: Team) => {
        if (!this.divisions.includes(item.division + ' Division')) {
          this.divisions.push(item.division + ' Division')}
      })

      if (teamSelect.value === '') teamSelect.options[0].selected = true;
      divSelect.options[0].selected = true;
      teamSelect.options[0].selected = true;
    }

    if (titleString === 'Filter By Division') {
      result = result.filter((item: Team) => {
        return item.division === filterString.split(' ')[0]
      })
      teamSelect.options[0].selected = true;
    }
    this.teams$ = of(result);
  }

  handleModal(event: Event) {
    let target: HTMLElement = event.target as HTMLElement;
    this.showPopup = false;
    if (this.selectedTeam !== undefined && target.innerHTML === 'Yes') 
      this.nbaService.removeTrackedTeam(this.selectedTeam);
  }

  handleRemoveTrackedTeam(team: Team) {
    this.showPopup = true;
    this.selectedTeam = team;
  }

  setSelectionOption(event: Event) {
    let target: HTMLSelectElement = event.target as HTMLSelectElement;
    console.log('Selected Value: ', target.selectedOptions[0].value);
    this.selectedValue = target.selectedOptions[0].value;
    this.resetGameHistory();
  }

  resetGameHistory() {
    // Trying to sync all selected game histories
    let trackedTeams = this.nbaService.getTrackedTeams();
    let selVal = Number(this.selectedValue.split(' ')[0]);
    trackedTeams.forEach(team => {
      if (this.stats instanceof TeamStatsComponent ) {
        this.stats.games$ = this.nbaService.getLastResults(team, selVal)
      }
    })
  }
}

