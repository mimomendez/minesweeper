(function() {
    'use strict';

    angular
        .module('minesweeper')

    //prevent right click window save image
    .directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, { $event: event });
                });
            });
        };
    })

    .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $interval) {

        var newGame = true;
        var clock;
        $scope.timer = 0;

        //set game initial values
        $scope.game = {
            mode: "off", // on - pause - off
            difficulty: "beg", //beg - inter - exp
            wtotal: 8, // 8 - 15 - 29
            htotal: 8, // 8 - 15 - 15
            mines: 10, // 10 - 40- 99
            flagCounter: 10
        };

        //clock images
        $scope.leftc = '../../assets/images/d0.png';
        $scope.leftd = '../../assets/images/d0.png';
        $scope.leftu = '../../assets/images/d0.png';
        $scope.rightc = '../../assets/images/d0.png';
        $scope.rightd = '../../assets/images/d0.png';
        $scope.rightu = '../../assets/images/d0.png';

        //change clock
        function myTimer() {
            $scope.timer++;
            var output = [],
                sNumber = $scope.timer.toString();
            for (var i = 0, len = sNumber.length; i < len; i += 1) {
                output.push(+sNumber.charAt(i));
            }
            if (output.length == 4) {
                $scope.rightc = '../../assets/images/d9.png';
                $scope.rightd = '../../assets/images/d9.png';
                $scope.rightu = '../../assets/images/d9.png';
            } else if (output.length == 3) {
                $scope.rightc = '../../assets/images/d' + output[0] + '.png';
                $scope.rightd = '../../assets/images/d' + output[1] + '.png';
                $scope.rightu = '../../assets/images/d' + output[2] + '.png';
            } else if (output.length == 2) {
                $scope.rightc = '../../assets/images/d0.png';
                $scope.rightd = '../../assets/images/d' + output[0] + '.png';
                $scope.rightu = '../../assets/images/d' + output[1] + '.png';
            } else {
                $scope.rightc = '../../assets/images/d0.png';
                $scope.rightd = '../../assets/images/d0.png';
                $scope.rightu = '../../assets/images/d' + output[0] + '.png';
            }
        };

        //update flag counter
        $scope.$watch('game.flagCounter', function(newValue, oldValue) {
            var output = [],
                sNumber = $scope.game.flagCounter.toString();
            for (var i = 0, len = sNumber.length; i < len; i += 1) {
                output.push(+sNumber.charAt(i));
            }
            if (output.length == 4) {
                $scope.leftc = '../../assets/images/d-.png';
                $scope.leftd = '../../assets/images/d9.png';
                $scope.leftu = '../../assets/images/d9.png';
            } else if (output.length == 3 && isNaN(output[0])) {
                $scope.leftc = '../../assets/images/d-.png';
                $scope.leftd = '../../assets/images/d' + output[1] + '.png';
                $scope.leftu = '../../assets/images/d' + output[2] + '.png';
            } else if (output.length == 2 && isNaN(output[0])) {
                $scope.leftc = '../../assets/images/d-.png';
                $scope.leftd = '../../assets/images/d0.png';
                $scope.leftu = '../../assets/images/d' + output[1] + '.png';
            } else if (output.length == 2 && !isNaN(output[0])) {
                $scope.leftc = '../../assets/images/d0.png';
                $scope.leftd = '../../assets/images/d' + output[0] + '.png';
                $scope.leftu = '../../assets/images/d' + output[1] + '.png';
            } else if (output.length == 1) {
                $scope.leftc = '../../assets/images/d0.png';
                $scope.leftd = '../../assets/images/d0.png';
                $scope.leftu = '../../assets/images/d' + output[0] + '.png';
            }
        }, true);

        //initial state of new game button
        $scope.face = {
            value: 0,
            src: '../../assets/images/face0.png'
        };

        //new game button
        $scope.clickFace = function() {
            $interval.cancel(clock);
            $scope.timer = 0;
            newGame = true;
            $scope.face = {
                value: 0,
                src: '../../assets/images/face0.png'
            };
            $scope.rightc = '../../assets/images/d0.png';
            $scope.rightd = '../../assets/images/d0.png';
            $scope.rightu = '../../assets/images/d0.png';
            $scope.changeGame($scope.game.difficulty);
        };

        //events on click cell
        $scope.touchFace = function() {
            $scope.face = {
                value: 1,
                src: '../../assets/images/face1.png'
            };
        }

        $scope.untouchFace = function() {
            $scope.face = {
                value: 0,
                src: '../../assets/images/face0.png'
            };
        }

        //change levels
        $scope.changeGame = function(diff) {
            $scope.face = {
                value: 0,
                src: '../../assets/images/face0.png'
            };
            $interval.cancel(clock);
            $scope.timer = 0;
            newGame = true;
            $scope.rightc = '../../assets/images/d0.png';
            $scope.rightd = '../../assets/images/d0.png';
            $scope.rightu = '../../assets/images/d0.png';
            switch (diff) {
                case 'beg':
                    $scope.game = {
                        mode: "off",
                        difficulty: "beg",
                        wtotal: 8,
                        htotal: 8,
                        mines: 10,
                        flagCounter: 10
                    }
                    break;
                case 'inter':
                    $scope.game = {
                        mode: "off",
                        difficulty: "inter",
                        wtotal: 15,
                        htotal: 15,
                        mines: 40,
                        flagCounter: 40
                    }
                    break;
                case 'exp':
                    $scope.game = {
                        mode: "off",
                        difficulty: "exp",
                        wtotal: 29,
                        htotal: 15,
                        mines: 99,
                        flagCounter: 99
                    }
                    break;
            };
            generateGrid();
        };

        generateGrid();

        function generateGrid() {
            var row = [],
                col = [],
                cell = {},
                id = 0;
            for (let i = 0; i <= $scope.game.htotal; i++) {
                for (let j = 0; j <= $scope.game.wtotal; j++) {
                    cell.mine = false;
                    cell.value = 0;
                    cell.posX = i;
                    cell.posY = j;
                    cell.id = id;
                    cell.src = '../../assets/images/untouch.png';
                    col.push(cell);
                    cell = {};
                    id++;
                }
                row.push(col);
                col = [];
            }
            $scope.rows = row;
            addMines();
        };

        function addMines() {
            for (var i = 0; i < $scope.game.mines; i++) {
                var row = Math.floor(Math.random() * $scope.game.htotal);
                var col = Math.floor(Math.random() * $scope.game.wtotal);
                if (!$scope.rows[row][col].mine) {
                    $scope.rows[row][col].mine = true;
                    updateNeighbors(row, col);
                } else {
                    i--;
                }
            }
        };

        //update numbers around mines
        function updateNeighbors(row, col) {
            var x = row - 1,
                xt = row + 1,
                y = col - 1,
                yt = col + 1;
            for (x; x <= xt; x++) {
                for (y; y <= yt; y++) {
                    //check limits
                    if (x >= 0 && y >= 0 && x <= $scope.game.htotal && y <= $scope.game.wtotal) {
                        //check mine
                        if (!$scope.rows[x][y].mine) {
                            $scope.rows[x][y].value = $scope.rows[x][y].value + 1;
                        }
                    }
                }
                y = col - 1;
            }
        };

        //reveals cells without values
        function emptyCellShow(row, col) {
            var x = row - 1,
                xt = row + 1,
                y = col - 1,
                yt = col + 1;
            for (x; x <= xt; x++) {
                for (y; y <= yt; y++) {
                    //check limits
                    if (x >= 0 && y >= 0 && x <= $scope.game.htotal && y <= $scope.game.wtotal) {
                        //check if cell was touched
                        if ($scope.rows[x][y].src == '../../assets/images/untouch.png') {
                            //check emptys neighbors
                            repacleCellImage($scope.rows[x][y]);
                            if ($scope.rows[x][y].value == 0) {
                                emptyCellShow(x, y);
                            }
                        }
                    }
                }
                y = col - 1;
            }
        };

        //check if game is finish
        function checkStatus() {
            var levelComplete = true;
            for (let i = 0; i <= $scope.game.htotal; i++) {
                for (let j = 0; j <= $scope.game.wtotal; j++) {
                    if ($scope.rows[i][j].src == '../../assets/images/qmark.png' || $scope.rows[i][j].src == '../../assets/images/untouch.png' && $scope.rows[i][j].mine == false) {
                        levelComplete = false;
                    }
                }
            }
            if (levelComplete) {
                alert("You Win!");
                $scope.face = {
                    value: 3,
                    src: '../../assets/images/face3.png'
                };
                $scope.leftc = '../../assets/images/d0.png';
                $scope.leftd = '../../assets/images/d0.png';
                $scope.leftu = '../../assets/images/d0.png';
                finishGame();
            }
        };

        $scope.rightClickCell = function(cell) {
            switch (cell.src) {
                case '../../assets/images/untouch.png':
                    cell.src = '../../assets/images/flag.png';
                    $scope.game.flagCounter--;
                    break;
                case '../../assets/images/flag.png':
                    cell.src = '../../assets/images/qmark.png';
                    $scope.game.flagCounter++;
                    break;
                case '../../assets/images/qmark.png':
                    cell.src = '../../assets/images/untouch.png';
                    break;
            }
        };

        $scope.clickCell = function(cell) {
            //check game status
            if ($scope.game.mode == 'off' && newGame) {
                $scope.game.mode = 'on';
                newGame = false;
                clock = $interval(myTimer, 1000);
            }
            if ($scope.game.mode == 'on') {
                if (cell.src != '../../assets/images/flag.png' && cell.src != '../../assets/images/qmark.png') {
                    if (cell.mine) {
                        cell.src = '../../assets/images/minered.png';
                        $scope.face = {
                            value: 2,
                            src: '../../assets/images/face2.png'
                        };
                        finishGame();
                    } else {
                        if (cell.src != '../../assets/images/empty.png') {
                            if (cell.src == '../../assets/images/untouch.png') {
                                repacleCellImage(cell);
                                if (cell.value == 0) {
                                    emptyCellShow(cell.posX, cell.posY);
                                }
                                checkStatus();
                            } else {
                                touchNumberHelper(cell.posX, cell.posY, cell.value);
                            }
                        }
                    }
                }
            }
        };

        function checkFlagAround(row, col, number) {
            var x = row - 1,
                xt = row + 1,
                y = col - 1,
                yt = col + 1,
                flagCounter = 0;
            for (x; x <= xt; x++) {
                for (y; y <= yt; y++) {
                    //check limits
                    if (x >= 0 && y >= 0 && x <= $scope.game.htotal && y <= $scope.game.wtotal) {
                        //check if cell was touched
                        if ($scope.rows[x][y].src == '../../assets/images/flag.png') {
                            //check emptys neighbors
                            flagCounter++;
                        }
                    }
                }
                y = col - 1;
            }
            if (flagCounter == number) {
                return true;
            } else {
                return false;
            }
        }

        function touchNumberHelper(row, col, number) {
            var help = checkFlagAround(row, col, number);
            if (help) {
                emptyCellShow(row, col);
            }
            checkStatus();
        }

        function repacleCellImage(cell) {
            switch (cell.value) {
                case 0:
                    cell.src = '../../assets/images/empty.png';
                    break;
                case 1:
                    cell.src = '../../assets/images/t1.png';
                    break;
                case 2:
                    cell.src = '../../assets/images/t2.png';
                    break;
                case 3:
                    cell.src = '../../assets/images/t3.png';
                    break;
                case 4:
                    cell.src = '../../assets/images/t4.png';
                    break;
                case 5:
                    cell.src = '../../assets/images/t5.png';
                    break;
                case 6:
                    cell.src = '../../assets/images/t6.png';
                    break;
                case 7:
                    cell.src = '../../assets/images/t7.png';
                    break;
                case 8:
                    cell.src = '../../assets/images/t8.png';
                    break;
                case 9:
                    cell.src = '../../assets/images/t9.png';
                    break;
            }
        };

        function finishGame() {
            $interval.cancel(clock);
            $scope.timer = 0;
            for (let i = 0; i <= $scope.game.htotal; i++) {
                for (let j = 0; j <= $scope.game.wtotal; j++) {
                    //mine
                    if ($scope.rows[i][j].src != '../../assets/images/minered.png') {
                        if ($scope.rows[i][j].mine) {
                            $scope.rows[i][j].src = '../../assets/images/mine.png';
                        } else if ($scope.rows[i][j].src == '../../assets/images/flag.png' && !$scope.rows[i][j].mine) {
                            $scope.rows[i][j].src = '../../assets/images/minecross.png';
                        } else if ($scope.rows[i][j].src != '../../assets/images/qmark.png') {
                            repacleCellImage($scope.rows[i][j]);
                        }
                    }
                }
            }
            $scope.game.mode = 'off';
        };
    }
})();