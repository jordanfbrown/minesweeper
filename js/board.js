Minesweeper.Game = (function() {
  var Game = function() {
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
    this.renderer = new Minesweeper.Renderer.Canvas({
      height: this.height,
      width: this.width,
      rows: this.rows,
      columns: this.columns,
      cellWidth: this.cellWidth
    });

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
      this.startTimer();
      this.playing = true;
    },

    startTimer: function() {
      if(this.timer) {
        clearInterval(this.timer);
      }

      var seconds = 0;
      var $timeElapsed = $('#time-elapsed');

      $timeElapsed.text(seconds);
      this.timer = setInterval(function() {
        $timeElapsed.text(++seconds);
      }, 1000);
    },

    renderBoard: function() {
      this.renderer.clearBoard();

      for(var y = 0; y < this.rows; y++) {
        for(var x = 0; x < this.columns; x++) {
          this.renderer.drawTile(x, y, '#aaa', '#000');
        }
      }
    },

    bindEvents: function() {
      this.$board.on('click', _.bind(this.handleClick, this));
      $('#new').on('click', _.bind(this.createBoard, this));
    },

    handleClick: function(e) {
      if(this.playing) {
        var x = Math.floor((e.pageX - this.$board.offset().left) / this.cellWidth);
        var y = Math.floor((e.pageY - this.$board.offset().top) / this.cellWidth);

        if(this.board[y][x] == this.TILE_TYPES.MINE) {
          this.gameOver();
        }
        else {
          this.revealTile(x, y);
        }
      }
    },

    revealTile: function(x, y) {
      if(!this.revealed[y][x]) {
        this.revealed[y][x] = true;
        this.renderer.drawTile(x, y, '#eee');

        if(this.board[y][x] === this.TILE_TYPES.MINE) {
          this.renderer.drawMine(x, y);
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
          this.renderer.drawNumber(this.board[y][x], x, y);
        }
      }
    },


    gameOver: function() {
      this.playing = false;
      clearInterval(this.timer);

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

