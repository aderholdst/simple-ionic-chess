angular.module('simple-chess.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, auth) {

  $scope.auth = auth;
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
      var chess = new Chess();

      var board = new Chessboard('board', {
        position: ChessUtils.FEN.startId,
        eventHandlers: {
          onPieceSelected: pieceSelected,
          onMove: pieceMove
        }
      });

      resetGame();

      function resetGame() {
        board.setPosition(ChessUtils.FEN.startId);
        chess.reset();

        updateGameInfo('Next player is white.');
      }

      function updateGameInfo(status) {
        $('#info-status').html(status);
        $('#info-fen').html(chess.fen());
        $('#info-pgn').html(chess.pgn());
      }

      function pieceMove(move) {

        var nextPlayer,
            status,
            chessMove = chess.move({
              from: move.from,
              to: move.to,
              promotion: 'q'
            });


        nextPlayer = 'white';
        if (chess.turn() === 'b') {
          nextPlayer = 'black';
        }

        if (chessMove !== null) {
          if (chess.in_checkmate() === true) {
            status = 'CHECKMATE! Player ' + nextPlayer + ' lost.';
          } else if (chess.in_draw() === true) {
            status = 'DRAW!';
          } else {
            status = 'Next player is ' + nextPlayer + '.';

            if (chess.in_check() === true) {
              status = 'CHECK! ' + status;
            }
          }

          updateGameInfo(status);
        }

        return chess.fen();
      }

      function pieceSelected(notationSquare) {
        var i,
            movesNotation,
            movesPosition = [];

        movesNotation = chess.moves({square: notationSquare, verbose: true});
        for (i = 0; i < movesNotation.length; i++) {
          movesPosition.push(ChessUtils.convertNotationSquareToIndex(movesNotation[i].to));
        }
        return movesPosition;
      }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('LoginCtrl', function($scope, auth, $state) {
  auth.signin({
    // This is a must for mobile projects
    popup: true,
    // Make the widget non closeable
    standalone: true,
    // This asks for the refresh token
    // So that the user never has to log in again
    offline_mode: true,
    device: 'Phone'
  }, function() {
    // Login was successful
    $state.go('app.playlists');
  }, function(error) {
    // Oops something went wrong during login:
    console.log("There was an error logging in", error);
  });
})
