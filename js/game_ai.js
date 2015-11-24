(function(){
  var boardPositions = ['tl', 'tc', 'tr', 'cl', 'cc', 'cr', 'bl', 'bc', 'br'];

  function Game_AI(player, opponent) {
    this.player = player;
    this.opponent = opponent;
  }

  window.Game_AI = Game_AI;

  Game_AI.prototype.min_max = function(game, depth) {
    if (game.over) return;

    var self = this;
    depth = depth || 0;

    var scores = {};

    var availableMoves = _.difference(boardPositions, _.keys(game.board));
    var bestMove = checkForObviousMove(game, availableMoves); // First moves are the most
                                                              // obvious, yet recursively intensive.

    if (bestMove === undefined) {
      _.each(availableMoves, function(move) {
          var possible_game = game.play(move);

          if (possible_game.over)
            scores[move] = self.score(possible_game, depth + 1);
          else
            scores[move] = self.min_max(possible_game, depth + 1).score;
      });

      if (game.turn === self.player)
        bestMove = _.max(_.keys(scores), function(move) {
          return scores[move];
        });
      else
        bestMove =  _.min(_.keys(scores), function(move) {
          return scores[move];
        });
    }

    return { move: bestMove, score: scores[bestMove]};
  };

  Game_AI.prototype.score = function(game, depth) {
    if (game.winner === this.player)
      return 10 - depth;
    else if (game.winner === this.opponent)
      return depth - 10;
    else
      return 0;
  };

  function checkForObviousMove(game, availableMoves){
    if (_.keys(availableMoves).length < 8) return; // No obvious moves.

    if (_.intersection(availableMoves, ['tl', 'tr', 'bl', 'br']).length !== 4)
      return 'cc';

    // tl and cc would work as the only two starting moves, but this feels more engaging.
    if (availableMoves.length === 9 || _.intersection(availableMoves, ['tc', 'cl', 'cc']).length !== 3)
      return 'tl';
    else if (_.intersection(availableMoves, ['bc', 'cr']).length !== 2)
      return 'br';
  }
})();
