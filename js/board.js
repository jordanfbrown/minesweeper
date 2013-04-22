Minesweeper.Game = (function() {
  var Game = function() {
    this.context = document.getElementById('board').getContext('2d');
    this.height = 200;
    this.width = 200;
    this.rows = 8;
    this.columns = 8;
    this.numMines = 10;
    this.board = [];
    this.revealed = [];
    this.TILE_TYPES = {
      MINE: 'M'
    };
    this.cellWidth = this.width / this.columns;
    this.$board = $('#board');

    this.bindEvents();
    this.setWidthAndHeight();
    this.createBoard();
  };

  Game.prototype = {

    setWidthAndHeight: function() {
      this.$board
        .attr({ height: this.height, width: this.width })
        .css({ height: this.height, width: this.width });
    },

    generateMinePositions: function() {
      var positions = [], row, column;

      while(positions.length < this.numMines) {
        var position = Math.floor(Math.random() * this.rows * this.columns - 1) + 1;
        if(!_.include(positions, position)) {
          positions.push(position);
        }
      }

      return _.map(positions, function(position) {
        column = position % this.columns;
        row = (position - column) / this.rows
        return { row: row, column: column };
      }, this);
    },

    createBoard: function() {
      this.context.fillRect(0, 0, this.height, this.width);
      for(var y = 0; y < this.rows; y++) {
        this.board[y] = [];
        this.revealed[y] = [];
      }

      _.each(this.generateMinePositions(), function(position) {
        this.board[position.row][position.column] = this.TILE_TYPES.MINE;
      }, this);

      for(var y = 0; y < this.rows; y++) {
        for(var x = 0; x < this.columns; x++) {
          this.revealed[y][x] = false;
          if(!this.board[y][x]) {
            this.board[y][x] = this.calculateNumberForTile(y, x);
          }
        }
      }

      this.renderBoard();
    },

    renderBoard: function() {
      this.context.fillStyle = '#aaa';
      this.context.strokeStyle = '#000';

      for(var y = 0; y < this.rows; y++) {
        for(var x = 0; x < this.columns; x++) {
          this.drawTile(x, y);
        }
      }
    },

    drawTile: function(x, y) {
      this.context.fillRect(this.cellWidth * x, this.cellWidth * y, this.cellWidth, this.cellWidth);
      this.context.strokeRect(this.cellWidth * x, this.cellWidth * y, this.cellWidth, this.cellWidth);
    },

    drawCircle: function(x, y) {
      var centerX = x * this.cellWidth + this.cellWidth / 2;
      var centerY = y * this.cellWidth + this.cellWidth / 2;
      var radius = this.cellWidth / 4;

      this.context.beginPath();
      this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      this.context.fillStyle = 'red';
      this.context.fill();
      this.context.lineWidth = 2;
      this.context.strokeStyle = '#000';
      this.context.stroke();
    },

    bindEvents: function() {
      this.$board.on('click', _.bind(this.handleClick, this));
      $('#new').on('click', _.bind(this.createBoard, this));
    },

    handleClick: function(e) {
      var x = Math.floor((e.pageX - this.$board.offset().left) / this.cellWidth);
      var y = Math.floor((e.pageY - this.$board.offset().top) / this.cellWidth);

      if(this.board[y][x] == this.TILE_TYPES.MINE) {
        this.gameOver();
      }
      else {
        this.revealTile(x, y);
      }
    },

    revealTile: function(x, y) {
      if(!this.revealed[y][x]) {
        this.revealed[y][x] = true;

        this.context.fillStyle = '#eee';
        this.drawTile(x, y);
        if(this.board[y][x] === this.TILE_TYPES.MINE) {
          this.drawCircle(x, y);
        }
        else if(this.board[y][x] === 0) {
          for(var i = -1; i <= 1; i++) {
            for(var j = -1; j <= 1; j++) {
              if(this.board[y + i] !== undefined && this.board[y + i][x + j] !== undefined) {
                this.revealTile(x + j, y + i);
              }
            }
          }
        }
        else {
          this.context.strokeText(this.board[y][x], this.cellWidth * x + this.cellWidth / 2 - 4, this.cellWidth * y + this.cellWidth / 2 + 4);
        }
      }
    },


    gameOver: function() {
      for(var y = 0; y < this.rows; y++) {
        for(var x = 0; x < this.columns; x++) {
          if(this.board[y][x] == this.TILE_TYPES.MINE) {
            this.revealTile(x, y);
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

