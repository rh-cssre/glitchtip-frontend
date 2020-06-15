import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Team } from "./teams.interfaces";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { baseUrl } from "src/app/constants";

interface TeamsState {
  teams: Team[] | null;
  teamMembers: any;
}

const initialState: TeamsState = {
  teams: null,
  teamMembers: null,
};

@Injectable({
  providedIn: "root",
})
export class TeamsService {
  private readonly state = new BehaviorSubject<TeamsState>(initialState);
  private readonly getState$ = this.state.asObservable();
  private readonly url = baseUrl;

  readonly teams$ = this.getState$.pipe(map((state) => state.teams));
  readonly teamMembers$ = this.getState$.pipe(
    map((state) => state.teamMembers)
  );

  constructor(private http: HttpClient) {}

  retrieveTeamsByOrg(orgSlug: string) {
    return this.http
      .get<Team[]>(`${this.url}/organizations/${orgSlug}/teams/`)
      .pipe(tap((teams) => this.setTeams(teams)));
  }

  retrieveTeamMembers(orgSlug: string, teamSlug: string) {
    return this.http
      .get(`${this.url}/teams/${orgSlug}/${teamSlug}/members/`)
      .pipe(tap((teamMembers) => this.setTeamMembers(teamMembers)));
  }

  createTeam(teamSlug: string, orgSlug: string) {
    const data = {
      slug: teamSlug,
    };
    return this.http
      .post<Team>(`${this.url}/organizations/${orgSlug}/teams/`, data)
      .pipe(tap((newTeam) => this.addOneTeam(newTeam)));
  }

  private setTeams(teams: Team[]) {
    this.state.next({ ...this.state.getValue(), teams });
  }

  private setTeamMembers(teamMembers: any) {
    this.state.next({ ...this.state.getValue(), teamMembers });
  }

  /**
   * Add new team to state
   * The new team needs to be added to the beginning of the Teams array
   */
  private addOneTeam(team: Team) {
    const getTeamsState = this.state.getValue().teams;
    const teams = getTeamsState ? getTeamsState : [];

    const newTeams = [team].concat(teams);
    if (newTeams) {
      this.state.next({
        ...this.state.getValue(),
        teams: newTeams,
      });
    }
  }
}
