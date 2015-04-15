/* globals console, window, document */

"use strict";

angular.module("fielddbAngular").controller("FieldDBController", function($scope, $stateParams, $rootScope) {

  if (FieldDB && FieldDB.FieldDBObject && FieldDB.FieldDBObject.application) {
    $scope.application = FieldDB.FieldDBObject.application;
    FieldDB.FieldDBObject.render = function() {
      try {
        if (!$scope.$$phase) {
          $scope.$apply(); //$digest or $apply
        }
      } catch (e) {
        console.warn("Rendering generated probably a digest erorr");
      }
    };


    document.addEventListener("logout", function(e) {
      console.log(e);
      $scope.application.bug("user has logged out, page will reload to clear state and take them to the welcome page.");
    }, false);

    document.addEventListener("authenticate:fail", function(e) {
      console.log(e);
      $scope.application.warn("user isn't able to see anything, show them the welcome page");
      // $scope.application.authentication.error = "";
      $scope.$apply(function() {
        console.log("  Redirecting the user to the welcome page");
        //http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
        // $location.path("/welcome", false);
      });
    }, false);

  } else {
    console.warn("The fielddb application was never created, are you sure you did new FieldDB.APP() somewhere?");
    window.alert("The app cannot load, please report this. ");
  }
  $rootScope.contextualize = function(message) {
    if (!FieldDB || !FieldDB.FieldDBObject || !FieldDB.FieldDBObject.application || !FieldDB.FieldDBObject.application.contextualizer || !FieldDB.FieldDBObject.application.contextualizer.data) {
      return message;
    }
    var result = FieldDB.FieldDBObject.application.contextualize(message);
    if ($rootScope.corpus && $rootScope.corpus.dbname && FieldDB) {
      var url = $rootScope.corpus.url || FieldDB.Database.prototype.BASE_DB_URL + "/" + $rootScope.corpus.dbname;
      result = result
        .replace(/CORPUS_DB_URL/g, url)
        .replace(/CORPUS_PAGE_URL/g, "http://lingsync.org/" + $rootScope.corpus.dbname.replace("-", "/") + "/" + $rootScope.corpus.titleAsUrl);
    }
    // if (!$scope.$$phase) {
    //   $scope.$digest(); //$digest or $apply
    // }
    return result;
  };

  $scope.loginDetails = $scope.loginDetails || {
    username: "",
    password: ""
  };
  $scope.application.debug($scope.application);
  if ($stateParams) {
    $scope.application.processRouteParams($stateParams);
  }
  // FieldDB.FieldDBConnection.connect();

  console.log("FieldDBController was loaded, this means almost everything in the corpus is available now");

  $scope.FieldDBComponents = {};
  for (var klass in FieldDB) {
    if(! FieldDB.hasOwnProperty(klass)){
      continue;
    }
    $scope.FieldDBComponents[klass] = {
      fieldDBtype: klass,
      url: "http://opensourcefieldlinguistics.github.io/FieldDB/docs/javascript/" + klass + ".html"
    };
  }


});