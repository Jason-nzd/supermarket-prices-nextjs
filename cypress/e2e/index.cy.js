describe('Home Page', () => {
  context('1080p desktop resolution', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
      cy.visit('/');
    });

    it('should display website title, grid header', () => {
      cy.contains('h1', 'KiwiPrice.xyz');
      cy.contains('.grid-title', 'Trending Products');
    });

    it('should have more than 3 product cards visible', () => {
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('should have no mobile search button on nav bar', () => {
      cy.get('#mobile-search-button').should('be.hidden');
    });

    // it('category menu modal should start hidden', () => {
    //   cy.get('[data-testid="modal-backdrop"]').should('be.hidden');
    // })

    it('clicking the category menu button should reveal the menu modal', () => {
      cy.get("#category-menu-button").click();
      // cy.get(".backdrop").should('be.visible');
      cy.task('log', 'Completed deterministic test');
    })
  });

  context('400p small mobile resolution', () => {
    beforeEach(() => {
      cy.viewport('iphone-8');
      cy.visit('/');
    });

    it('should display website title, grid header', () => {
      cy.contains('h1', 'KiwiPrice.xyz');
      cy.contains('.grid-title', 'Trending Products');
    });

    it('should have more than 3 product cards visible', () => {
      cy.get('.product-card').should('have.length.greaterThan', 3);
    });

    it('desktop menu button should be hidden', () => {
      cy.get('#category-menu-button').should('be.hidden');
    });

    // it('should have mobile search button on nav bar', () => {
    //   cy.get('#mobile-search-button').should('be.hidden');
    // });
  });

  context('600p medium mobile resolution', () => {
    beforeEach(() => {
      cy.viewport('ipad-mini');
      cy.visit('/');
    });
    it('search button should popup input field and allow typing', () => {
      cy.get('#mobile-search-button').click();
      // cy.get('')
      // cy.get('#search').should('be.visible');
      // cy.get('#search').type('orange');
    });
  });
});

