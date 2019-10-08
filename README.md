# minesweeper
AngularJS - minesweeper game

This proyect was createing using YEOMAN (https://github.com/yeoman/generator-angular). I use angularJS.

This is the first version of game Minesweeper. It's not complete, there are some points that are not complete like:
* time tracking.
* new game button (new game are creating by changing game option level).
* right click button: it's working only to set flags and question marks but on a finish game do not show correct images.
* option to create a custom game level (number of rows, cols and mines)
This points will be done in next version.

NOTES:
# This game not required more than one page so I use one main controller and one main view. The left panel have a radio button with game levels options and right panel contain the grid.
# I had to create a simpre directive to aboid a save image's window when user use right click on grid. This directive calls rightCellClick's funtion that set flag and question mark images.
# All functions has a really clear name that defines and explain in certain way what code does.
# I choose a two dimention matrix to implement the grid. Every cell is an object that contains certains properties:
1-mine => boolean value that defines is cell contains a mine.
2-value => integer value that defines how many mines are around them.
3-posX & posY => position or number of row & column (STARTS AT 0!!!).
5-id => identificator (not used momentarily).
6-src => image's route that represent all states in differents moments.
