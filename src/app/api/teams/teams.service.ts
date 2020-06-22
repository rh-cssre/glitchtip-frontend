import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Team } from "./teams.interfaces";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map, tap } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import { Member } from "../organizations/organizations.interface";
import { UserService } from "../user/user.service";

interface TeamsState {
  teams: Team[] | null;
  teamMembers: Member[];
}

const initialState: TeamsState = {
  teams: null,
  teamMembers: [],
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

  readonly userTeamRole$ = combineLatest([
    this.teamMembers$,
    this.userService.activeUserEmail$,
  ]).pipe(
    map(([teamMembers, userEmail]) => {
      const activeTeamMember = teamMembers.find(
        (teamMember) => teamMember.email === userEmail
      );
      return activeTeamMember?.role;
    })
  );

  constructor(private http: HttpClient, private userService: UserService) {}

  retrieveTeamsByOrg(orgSlug: string) {
    return this.http
      .get<Team[]>(`${this.url}/organizations/${orgSlug}/teams/`)
      .pipe(tap((teams) => this.setTeams(teams)));
  }

  retrieveTeamMembers(orgSlug: string, teamSlug: string) {
    return this.http
      .get<Member[]>(`${this.url}/teams/${orgSlug}/${teamSlug}/members/`)
      .pipe(tap((teamMembers) => this.setTeamMembers(teamMembers)));
  }

  addTeam(team: Team) {
    this.addOneTeam(team);
  }

  private setTeams(teams: Team[]) {
    this.state.next({ ...this.state.getValue(), teams });
  }

  private setTeamMembers(teamMembers: Member[]) {
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
