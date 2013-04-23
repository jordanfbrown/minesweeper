Minesweeper.Renderer.Canvas = (function() {
  var RendererCanvas = function(options) {
    this.width = options.width;
    this.height = options.height;
    this.rows = options.rows;
    this.columns = options.columns;
    this.cellWidth = options.cellWidth;
    this.context = document.getElementById('board').getContext('2d');
  };

  RendererCanvas.prototype = {

    clearBoard: function() {
      this.context.fillStyle = '#fff';
      this.context.fillRect(0, 0, this.height, this.width);
    },

    drawTile: function(x, y, fillStyle, strokeStyle) {
      if(fillStyle) {
        this.context.fillStyle = fillStyle;
      }
      if(strokeStyle) {
        this.context.strokeStyle = strokeStyle;
      }
      this.context.fillRect(this.cellWidth * x, this.cellWidth * y, this.cellWidth, this.cellWidth);
      this.context.strokeRect(this.cellWidth * x, this.cellWidth * y, this.cellWidth, this.cellWidth);
    },

    drawMine: function(x, y) {
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

    drawNumber: function(number, x, y) {
      this.context.strokeText(number, this.cellWidth * x + this.cellWidth / 2 - 4, this.cellWidth * y + this.cellWidth / 2 + 4);
    }
  };

  return RendererCanvas;
})();