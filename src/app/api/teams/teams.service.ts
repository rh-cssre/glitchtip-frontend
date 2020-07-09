import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Team, TeamErrors, TeamLoading } from "./teams.interfaces";
import { BehaviorSubject, combineLatest, EMPTY } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
import { baseUrl } from "src/app/constants";
import { Member } from "../organizations/organizations.interface";
import { UserService } from "../user/user.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

interface TeamsState {
  teams: Team[] | null;
  team: Team | null;
  teamMembers: Member[];
  errors: TeamErrors;
  loading: TeamLoading;
}

const initialState: TeamsState = {
  teams: null,
  team: null,
  teamMembers: [],
  errors: { updateName: "", deleteTeam: "" },
  loading: { updateName: false, deleteTeam: false },
};

@Injectable({
  providedIn: "root",
})
export class TeamsService {
  private readonly state = new BehaviorSubject<TeamsState>(initialState);
  private readonly getState$ = this.state.asObservable();
  private readonly url = baseUrl;

  readonly teams$ = this.getState$.pipe(map((state) => state.teams));
  readonly team$ = this.getState$.pipe(map((data) => data.team));
  readonly teamMembers$ = this.getState$.pipe(
    map((state) => state.teamMembers)
  );
  readonly loading$ = this.getState$.pipe(map((data) => data.loading));
  readonly errors$ = this.getState$.pipe(map((data) => data.errors));

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

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  retrieveTeamsByOrg(orgSlug: string) {
    return this.http
      .get<Team[]>(`${this.url}/organizations/${orgSlug}/teams/`)
      .pipe(tap((teams) => this.setTeams(teams)));
  }

  retrieveSingleTeam(orgSlug: string, teamSlug: string) {
    return this.http
      .get<Team>(`${this.url}/teams/${orgSlug}/${teamSlug}/`)
      .pipe(tap((resp) => this.setSingleTeam(resp)))
      .subscribe();
  }

  retrieveTeamMembers(orgSlug: string, teamSlug: string) {
    return this.http
      .get<Member[]>(`${this.url}/teams/${orgSlug}/${teamSlug}/members/`)
      .pipe(tap((teamMembers) => this.setTeamMembers(teamMembers)));
  }

  updateTeamSlug(orgSlug: string, teamSlug: string, newTeamSlug: string) {
    const url = `${this.url}/teams/${orgSlug}/${teamSlug}/`;
    const data = { slug: newTeamSlug };
    this.setUpdateTeamSlugLoading(true);
    return this.http.put<Team>(url, data).pipe(
      tap((resp) => {
        this.router.navigate([
          "settings",
          orgSlug,
          "teams",
          resp.slug,
          "settings",
        ]);
        this.setUpdateTeamSlugLoading(false);
        this.snackBar.open(
          `Your team slug has been changed to #${resp.slug}`,
          undefined,
          {
            duration: 4000,
          }
        );
        this.setSingleTeam(resp);
      }),
      catchError((error: HttpErrorResponse) => {
        this.setUpdateTeamSlugError(error);
        return EMPTY;
      })
    );
  }

  deleteTeam(orgSlug: string, teamSlug: string) {
    const url = `${this.url}/teams/${orgSlug}/${teamSlug}/`;
    this.setDeleteTeamLoading(true);
    return this.http.delete(url).pipe(
      tap(() => {
        this.setDeleteTeamLoading(false);
        this.snackBar.open(
          `You have successfully deleted #${teamSlug}`,
          undefined,
          {
            duration: 4000,
          }
        );
        this.router.navigate(["settings", orgSlug, "teams"]);
      }),
      catchError((error: HttpErrorResponse) => {
        this.setDeleteTeamError(error);
        return EMPTY;
      })
    );
  }

  private setDeleteTeamLoading(loading: boolean) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loading: {
        ...state.loading,
        deleteTeam: loading,
      },
    });
  }

  private setDeleteTeamError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      errors: {
        ...state.errors,
        deleteTeam: `${error.statusText}: ${error.status}`,
      },
      loading: {
        ...state.loading,
        deleteTeam: false,
      },
    });
  }

  addTeam(team: Team) {
    this.addOneTeam(team);
  }

  removeMember(memberId: number) {
    this.removeTeamMember(memberId);
  }

  private setTeams(teams: Team[]) {
    this.state.next({ ...this.state.getValue(), teams });
  }

  private setSingleTeam(team: Team) {
    this.state.next({ ...this.state.getValue(), team });
  }

  private setTeamMembers(teamMembers: Member[]) {
    this.state.next({ ...this.state.getValue(), teamMembers });
  }

  private removeTeamMember(memberId: number) {
    const filteredMembers = this.state
      .getValue()
      .teamMembers.filter((teamMember) => teamMember.id !== memberId);
    if (filteredMembers) {
      this.state.next({
        ...this.state.getValue(),
        teamMembers: filteredMembers,
      });
    }
  }

  private setUpdateTeamSlugLoading(loading: boolean) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      loading: {
        ...state.loading,
        updateName: loading,
      },
    });
  }

  private setUpdateTeamSlugError(error: HttpErrorResponse) {
    const state = this.state.getValue();
    this.state.next({
      ...state,
      errors: {
        ...state.errors,
        updateName: `${error.statusText}: ${error.status}`,
      },
      loading: {
        ...state.loading,
        updateName: false,
      },
    });
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
