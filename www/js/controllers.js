angular.module('simple-chess.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, auth, $state) {


        // Perform the login action when the user submits the login form
        $scope.doLogout = function () {
            auth.signout();
            $state.go('login')
            //store.remove('profile');
            //store.remove('token');
        };
    })

    .controller('GamesCtrl', function ($scope, auth, $ionicViewService, $firebase) {

        $ionicViewService.clearHistory();

        var ref = new Firebase("https://intense-torch-3062.firebaseio.com/games");

        var sync = $firebase(ref);
        // create a synchronized array for use in our HTML code
        $scope.games = sync.$asArray();

        $scope.auth = auth;

        $scope.startGame = function () {
            var newGame = {
                'playerOne': {
                    'userId': auth.profile.user_id,
                    'nickname': auth.profile.nickname
                },
                'openedOn': new Date().getTime()
            };
            $scope.games.$add(newGame);
        };

        function joinGame(game, profile) {
            game.playerTwo = {
                    'userId': profile.user_id,
                    'nickname': profile.nickname
            };
            console.log($scope.games);
            $scope.games.$save(game);
        };

        $scope.canJoin = function(game, profile){
            var userId = profile.user_id;
            return !game.playerTwo && game.playerOne && game.playerOne.userId != userId;
        };

        $scope.isMember = function(game, profile){
            var userId = profile.user_id;
            return game.playerOne.userId == userId || (game.playerTwo && game.playerTwo.userId == userId);
        };

        $scope.enterGame = function(game, profile){
            if($scope.canJoin(game, profile)){
                joinGame(game, profile);
            }
        };

    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {

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

    .controller('LoginCtrl', function ($scope, auth, $state) {
        auth.signin({
            // This is a must for mobile projects
            popup: true,
            // Make the widget non closeable
            standalone: true,
            // This asks for the refresh token
            // So that the user never has to log in again
            offline_mode: true,
            device: 'Phone'
        }, function () {
            // Login was successful
            $state.go('app.games');
        }, function (error) {
            // Oops something went wrong during login:
            console.log("There was an error logging in", error);
        });
    })
