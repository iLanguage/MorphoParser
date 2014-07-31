'use strict';
var debug = false;

describe('Directive: fielddb-authentication', function() {

  // load the directive's module and the template
  beforeEach(module('fielddbAngularApp', 'views/authentication.html'));
  var el, scope, compileFunction;

  beforeEach(inject(function($rootScope, $compile) {
    el = angular.element('<div data-fielddb-authentication json="authentication"></div>');
    scope = $rootScope.$new();
    scope.authentication = {
      user: {
        authenticated: false
      }
    };
    compileFunction = $compile(el);
    // bring html from templateCache
    scope.$digest();
    if (debug) {
      console.log('post compile', el.html()); // <== html here has {{}}
    }
  }));

  // http://stackoverflow.com/questions/17223850/how-to-test-directives-that-use-templateurl-and-controllers
  it('should show login form if no one is logged in', function() {

    inject(function() {
      compileFunction(scope); // <== the html {{}} are bound
      scope.$digest(); // <== digest to get the render to show the bound values
      if (debug) {
        console.log('post link', el.html());
        console.log('scope authentication ', scope.authentication);
      }
      expect(angular.element(el.find('button')[0]).text().trim()).toEqual('Login');
    });
  });

  it('should show logout button if someone is logged in', function() {

    inject(function() {
      scope.authentication.user.authenticated = true;
      compileFunction(scope); // <== the html {{}} are bound
      scope.$digest(); // <== digest to get the render to show the bound values
      if (debug) {
        console.log('post link', el.html());
        console.log('scope authentication ', scope.authentication);
      }
      expect(angular.element(el.find('div')[0]).attr('class')).toContain('ng-hide');
    });
  });

  it('should login users', function() {
    //https://egghead.io/lessons/angularjs-unit-testing-directive-scope
    compileFunction(scope); // <== the html {{}} are bound
    expect(el.scope().login).toBeDefined();
  });

  it('should logout users', function() {
    compileFunction(scope); // <== the html {{}} are bound
    expect(el.scope().logout).toBeDefined();
  });

  it('should register users', function() {
    compileFunction(scope); // <== the html {{}} are bound
    expect(el.scope().register).toBeDefined();
  });

});