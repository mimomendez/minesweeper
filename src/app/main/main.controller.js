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
    function MainController($scope) {
        var vm = this;

        //set game initial values
        $scope.game = {
            mode: "off", // on - pause - off
            difficulty: "beg", //beg - inter - exp - cust
            wtotal: 8, // 8 - 15 - 29
            htotal: 8, // 8 - 15 - 15
            mines: 10 // 10 - 40- 99
        };

        //change levels
        $scope.changeGame = function(diff) {
            switch (diff) {
                case 'beg':
                    $scope.game = {
                        mode: "off",
                        difficulty: "beg",
                        wtotal: 8,
                        htotal: 8,
                        mines: 10
                    }
                    break;
                case 'inter':
                    $scope.game = {
                        mode: "off",
                        difficulty: "inter",
                        wtotal: 15,
                        htotal: 15,
                        mines: 40
                    }
                    break;
                case 'exp':
                    $scope.game = {
                        mode: "off",
                        difficulty: "exp",
                        wtotal: 29,
                        htotal: 15,
                        mines: 99
                    }
                    break;
            }
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

        //update numbers aorund mines
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
        }

        //check if game is finish
        function checkStatus() {
            var levelComplete = true;
            for (let i = 0; i <= $scope.game.htotal; i++) {
                for (let j = 0; j <= $scope.game.wtotal; j++) {
                    if ($scope.rows[i][j].src == '../../assets/images/untouch.png' && $scope.rows[i][j].mine == false) {
                        levelComplete = false;
                    }
                }
            }
            if (levelComplete) {
                alert("You Win!");
                finishGame();
            }
        }

        $scope.rightClickCell = function(cell) {
            switch (cell.src) {
                case '../../assets/images/untouch.png':
                    cell.src = '../../assets/images/flag.png';
                    break;
                case '../../assets/images/flag.png':
                    cell.src = '../../assets/images/qmark.png';
                    break;
                case '../../assets/images/qmark.png':
                    cell.src = '../../assets/images/untouch.png';
                    break;
            }
        }

        $scope.clickCell = function(cell) {
            if (cell.mine) {
                cell.src = '../../assets/images/minered.png';
                alert("You Lose!");
                finishGame();
            } else {
                repacleCellImage(cell);
                if (cell.value == 0) {
                    emptyCellShow(cell.posX, cell.posY);
                }
                checkStatus();
            }
        };

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
        }

        function finishGame() {
            for (let i = 0; i <= $scope.game.htotal; i++) {
                for (let j = 0; j <= $scope.game.wtotal; j++) {
                    //mine
                    if ($scope.rows[i][j].src != '../../assets/images/minered.png') {
                        if ($scope.rows[i][j].mine) {
                            $scope.rows[i][j].src = '../../assets/images/mine.png';
                        } else {
                            repacleCellImage($scope.rows[i][j]);
                        }
                    }
                }
            }
        }
    }
})();