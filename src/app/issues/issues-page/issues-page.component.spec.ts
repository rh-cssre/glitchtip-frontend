// tslint:disable:no-any
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule } from "@angular/material/table";
import { of } from "rxjs";

import { IssuesPageComponent } from "./issues-page.component";
import { MaterialModule } from "src/app/shared/material.module";
import { issueList } from "./issues-test-data";

describe("IssuesPageComponent", () => {
  let component: IssuesPageComponent;
  let fixture: ComponentFixture<IssuesPageComponent>;
  let ISSUES;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IssuesPageComponent],
        imports: [
          MaterialModule,
          HttpClientTestingModule,
          RouterTestingModule,
          ReactiveFormsModule,
          MatTableModule,
          NoopAnimationsModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    ISSUES = of(issueList);
    fixture = TestBed.createComponent(IssuesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.issues$ = ISSUES as any;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should handle `query` strings", () => {
    const queries: {
      queryString: string;
      expectedObject: { [key: string]: string };
    }[] = [
      {
        queryString: 'is:resolved "environment":"another one"',
        expectedObject: {
          is: "resolved",
          environment: "another one",
        },
      },
      {
        queryString: '"environment":"production"',
        expectedObject: { environment: "production" },
      },
      {
        queryString:
          '"os.name":"Ubuntu" "environment":"test" "browser.name":"Firefox"',
        expectedObject: {
          "os.name": "Ubuntu",
          environment: "test",
          "browser.name": "Firefox",
        },
      },
      {
        queryString: 'has:browser "browser.name":"Firefox"',
        expectedObject: {
          has: "browser",
          "browser.name": "Firefox",
        },
      },
    ];

    queries.forEach((query) => {
      const queryObject = component.getQueryAsObject(query.queryString);
      const remadeQueryString = component.getQueryObjectAsString(queryObject);
      expect(queryObject).toEqual(query.expectedObject);
      expect(remadeQueryString).toEqual(query.queryString);
      if (query.expectedObject.hasOwnProperty("environment")) {
        expect(component.getEnvironmentFromQuery(query.queryString)).toEqual(
          query.expectedObject.environment
        );
      }
    });
  });

  it("should update `query` strings with new environment", () => {
    const queries: {
      queryString: string | undefined;
      newEnvironment: string | null;
      expectedQueryString: string | null;
    }[] = [
      // no query, empty envname string: do nothing
      {
        queryString: undefined,
        newEnvironment: null,
        expectedQueryString: null,
      },
      // no query, envname string: create environment query
      {
        queryString: undefined,
        newEnvironment: "production",
        expectedQueryString: '"environment":"production"',
      },
      // query, empty envname: delete environment query if it's there
      {
        queryString: '"environment":"production"',
        newEnvironment: null,
        expectedQueryString: null,
      },
      // query, envname: update environment query
      {
        queryString: '"environment":"production"',
        newEnvironment: "staging",
        expectedQueryString: '"environment":"staging"',
      },
      // other queries, no env query, envname: add environment query
      {
        queryString: 'has:browser "browser.name":"Firefox"',
        newEnvironment: "staging",
        expectedQueryString:
          'has:browser "browser.name":"Firefox" "environment":"staging"',
      },
      // other queries, env query, envname: update environment query
      {
        queryString:
          'has:browser "browser.name":"Firefox" "environment":"production"',
        newEnvironment: "production",
        expectedQueryString:
          'has:browser "browser.name":"Firefox" "environment":"production"',
      },
      // other queries, env query, envname: update environment query
      {
        queryString:
          'has:browser "browser.name":"Firefox" "environment":"production"',
        newEnvironment: "staging",
        expectedQueryString:
          'has:browser "browser.name":"Firefox" "environment":"staging"',
      },
      // other queries, env query, envname: update environment query (different order)
      {
        queryString:
          '"environment":"production" has:browser "browser.name":"Firefox"',
        newEnvironment: "staging",
        expectedQueryString:
          '"environment":"staging" has:browser "browser.name":"Firefox"',
      },
      // other queries, env query, null envname: delete environment query
      {
        queryString: '"browser.name":"Firefox" "environment":"production"',
        newEnvironment: null,
        expectedQueryString: '"browser.name":"Firefox"',
      },
    ];

    queries.forEach((query) => {
      const newQuery = component.getNewQueryEnvironment(
        query.newEnvironment,
        query.queryString
      );
      expect(newQuery).toEqual(query.expectedQueryString);
    });
  });

  it("should output `query` strings based on how it matches with a list of environments", () => {
    const environmentList: string[] = ["production", "staging", "dev"];

    // No query
    const query1 = component.removeEnvironmentQueryIfMatched(
      environmentList,
      undefined
    );
    expect(query1).toEqual(false);

    // Query with no environment in it
    const query2 = component.removeEnvironmentQueryIfMatched(
      environmentList,
      '"os.name":"Android"'
    );
    expect(query2).toEqual(false);

    // Query with environment in it, matches a list
    const query3 = component.removeEnvironmentQueryIfMatched(
      environmentList,
      '"environment":"production"'
    );
    expect(query3).toEqual(false);

    // Query with environment in it, matches a list
    const query4 = component.removeEnvironmentQueryIfMatched(
      environmentList,
      '"os.name":"Android" "environment":"production"'
    );
    expect(query4).toEqual(false);

    // Query with only an environment in it, doesn't match a list
    const query5 = component.removeEnvironmentQueryIfMatched(
      environmentList,
      '"environment":"secret-garden"'
    );
    expect(query5).toEqual(null);

    // Query with an environment and something else in it, doesn't match a list: return query string
    const query6 = component.removeEnvironmentQueryIfMatched(
      environmentList,
      '"os.name":"Android" "environment":"secret-garden"'
    );
    expect(query6).toEqual('"os.name":"Android"');
  });
});
