angular.module('simple-chess.services', [])

    .service('games', function($firebase) {
        var ref = new Firebase("https://intense-torch-3062.firebaseio.com/");

        // create an AngularFire reference to the data
        var sync = $firebase(ref);
        // download the data into a local object
        $scope.data = sync.$asObject();
    });
