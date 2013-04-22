Minesweeper.Game = (function() {
  var Game = function() {
    this.context = document.getElementById('board').getContext('2d');
    this.height = 400;
    this.width = 400;
    this.rows = 8;
    this.columns = 8;
    this.numMines = 10;
    this.board = [];
    this.TILE_TYPES = {
      MINE: 'mine',
      NUMBER: 'number',
      EMPTY: 'empty'
    };

    this.setWidthAndHeight();
    this.createBoard();
  };

  Game.prototype = {

    setWidthAndHeight: function() {
      $('#board')
        .attr({ height: this.height, width: this.width })
        .css({ height: this.height, width: this.width });
    },

    generateMinePositions: function() {
      var positions = [], row, column;

      for(var i = 0; i < this.numMines; i++) {
        positions = this.addMinePosition(positions);
      }

      return _.map(positions, function(position) {
        column = position % this.columns;
        row = (position - column) / this.rows
        return { row: row, column: column };
      }, this);
    },

    addMinePosition: function(positions) {
      var position = Math.floor(Math.random() * this.rows * this.columns - 1);
      if(!_.include(positions, position)) {
        positions.push(position);
      }
      else {
        this.addMinePosition(positions);
      }

      return positions;
    },

    createBoard: function() {
      for(var y = 0; y < this.rows; y++) {
        this.board[y] = [];
      }

      var minePositions = this.generateMinePositions();
      _.each(minePositions, function(position) {
        this.board[position.row][position.column] = this.TILE_TYPES.MINE;
      }, this);

      for(var y = 0; y < this.rows; y++) {
        for(var x = 0; x < this.columns; x++) {
          if(!this.board[y][x]) {
            this.board[y][x] = this.calculateNumberForTile(y, x);
          }
        }
      }
    },

    calculateNumberForTile: function(row, column) {
      var number = 0;
      for(var i = -1; i <= 1; i++) {
        for(var j = -1; j <= 1; j++) {
          if(this.board[row + i] && this.board[row + i][column + j] === this.TILE_TYPES.MINE) {
            number += 1;
          }
        }
      }
      return number;
    }
  };

  return Game;
})();

