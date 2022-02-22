import { seedBackend, requestLogin } from "./utils";
import { organization } from "../fixtures/variables";

describe("List, add, update and delete uptime Monitors", () => {
    beforeEach(() => {
        seedBackend();
        requestLogin();
    });
  
    it("Should list a single monitor, see alert info for that monitor, then update that monitor and see updated monitor on list", () => {
        cy.visit(`/${organization.slug}/uptime-monitors/`);
        cy.contains("cytestmonitor").click();
        cy.wait(1000);
        cy.contains("Uptime details for cytestmonitor");
        cy.contains("This project has no uptime alerts configured");
        cy.get('#monitor-settings').click();
        cy.get('#monitor-name').should('have.value', "cytestmonitor")
            .clear().type("new name");
        cy.get('button').contains('Update Monitor').click();
        cy.visit(`/${organization.slug}/uptime-monitors/`);
        cy.contains("new name");
    });

    it("should delete a monitor and not see that monitor on list", () => {
        cy.visit(`/${organization.slug}/uptime-monitors/`);
        cy.contains("cytestmonitor").click();
        cy.get('#monitor-settings').click(); 
        cy.on('window:confirm', (text) => {
            expect(text).to.contains('Are you sure you want to remove this monitor?');
          });
        cy.get('#delete-monitor').contains('Delete Monitor').click();
        cy.contains("cytestmonitor").should('not.exist');
      });
    
    it("Should not be able to add monitor with invalid values", () => {
        cy.visit(`/${organization.slug}/uptime-monitors/new`);
        cy.get('#monitor-url').type("invalid url");
        cy.get('#interval').clear().type("86400");
        cy.get('#monitor-submit').click();
        cy.get('#expected-status').clear();
        cy.contains("Enter a monitor name");
        cy.contains("Enter a valid URL");
        cy.contains("Enter a status code number");
        cy.contains("The number needs to be less than 86400 (24 hours).");
    });  
    
    it("Should add a single monitor and see that monitor on list", () => {
        cy.visit(`/${organization.slug}/uptime-monitors/`);
        cy.get('#add-monitor').click();
        cy.get('#monitor-name').type("secondmonitor");
        cy.get('#monitor-url').type("www.twitter.com");
        cy.get('#associated-project').click().get('mat-option').contains('NicheScrip').click();
        cy.get('#monitor-type').click().get('mat-option').contains("Heartbeat").click();
        cy.get('#interval').clear().type("605");
        cy.get('#monitor-submit').click();
        cy.contains("Uptime details for secondmonitor");
        cy.visit(`/${organization.slug}/uptime-monitors/`);
        cy.contains("secondmonitor");
    });
  });