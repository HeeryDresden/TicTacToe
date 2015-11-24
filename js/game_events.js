(function(){
  var boardPositions = ['tl', 'tc', 'tr', 'cl', 'cc', 'cr', 'bl', 'bc', 'br'];
  var Game, game, Game_AI, game_ai;

  window.resetGame = resetGame;
  resetGame( { id: 'play_as_x'} );

  _.each(document.getElementsByClassName('gp-cell'), function(cell){
    cell.onclick = gamepadCellClicked;
  });

  function gamepadCellClicked() {
    if (game.drawing || game.over) return;

    game = game.play(this.className.split(" ")[1]);

    drawGame(function(){
      if (!game.over)
        playAI();
    });
  }

  function playAI(){
    var bestMove = game_ai.min_max(game);
    game = game.play(bestMove.move);

    drawGame();
  }

  function drawGame(callback) {
    _.each(_.keys(game.board), function(cell) {
      var elem = document.querySelector('.pad .' + cell);

      if (elem.childNodes.length !== 0) return;

      game.drawing = true;

      var span = document.createElement('span');
      span.className = game.board[cell] === 'X'? 'X xSvg': 'O oSvg';
      elem.appendChild(span);
    });

    setTimeout(function() {
      game.drawing = false;

      if (game.over && game.winner)
        document.getElementById('victorBanner').innerHTML = 'Player ' + game.winner + ' won the game!';
      else if (game.over)
        document.getElementById('victorBanner').innerHTML = 'The game was a tie!';

      if (callback)
        callback();
    }, 350);
  }

  function resetGame(elem){
    Game = Game || window.Game;
    Game_AI = Game_AI || window.Game_AI;

    document.getElementById('victorBanner').innerHTML = '';

    _.each(document.getElementsByClassName('gp-cell'), function(cell){
      if (cell.childNodes.length === 1)
        cell.removeChild(cell.childNodes[0]);
    });

    game = new Game();

    if (elem.id === 'play_as_o') {
      game_ai = new Game_AI('X', 'O');
      playAI();
    } else {
      game_ai = new Game_AI('O', 'X');
    }
  }
})();
