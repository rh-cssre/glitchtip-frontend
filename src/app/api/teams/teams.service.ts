import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Team } from "./teams.interfaces";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { baseUrl } from "src/app/constants";

interface TeamsState {
  teams: Team[] | null;
}

const initialState: TeamsState = {
  teams: null,
};

@Injectable({
  providedIn: "root",
})
export class TeamsService {
  private readonly state = new BehaviorSubject<TeamsState>(initialState);
  private readonly getState$ = this.state.asObservable();
  private readonly url = baseUrl;

  readonly teams$ = this.getState$.pipe(map((state) => state.teams));

  constructor(private http: HttpClient) {}

  retrieveTeamsByOrg(orgSlug: string) {
    return this.http
      .get<Team[]>(`${this.url}/organizations/${orgSlug}/teams/`)
      .pipe(tap((teams) => this.setTeams(teams)));
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

  private addOneTeam(team: Team) {
    const newTeams = this.state.getValue().teams?.concat([team]);
    if (newTeams) {
      this.state.next({
        ...this.state.getValue(),
        teams: newTeams,
      });
    }
  }
}
