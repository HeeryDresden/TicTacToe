(function(){
  var boardPositions = ['tl', 'tc', 'tr', 'cl', 'cc', 'cr', 'bl', 'bc', 'br'];
  var winningScenarios = [
    ['tl', 'tc', 'tr'],
    ['cl', 'cc', 'cr'],
    ['bl', 'bc', 'br'],
    ['tl', 'cl', 'bl'],
    ['tc', 'cc', 'bc'],
    ['tr', 'cr', 'br'],
    ['tl', 'cc', 'br'],
    ['tr', 'cc', 'bl']
  ];

  function Game(board) {
    var self = this;
    self.board = board || {};

    var plays = { X: 0, O: 0};

    for (var move in self.board)
      plays[self.board[move]]++;

    self.turn = plays.X === plays.O? 'X': 'O';

    // Counts how many scenarios each player has won.
    var scoreSheet = _.countBy(winningScenarios, function(scenario){
      // Counts how many moves each player has played in this scenario.
      var playCountByPlayer = _.countBy(scenario, function(move){
        return self.board[move];
      });

      // Returns a player if they played each move in a winning scenario.
      return _.findKey(playCountByPlayer, function(val) { return val === 3; });
    });

    scoreSheet.X = scoreSheet.X || 0;
    scoreSheet.O = scoreSheet.O || 0;

    if (scoreSheet.X > scoreSheet.O)
      self.winner = 'X';
    else if (scoreSheet.O > scoreSheet.X)
      self.winner = 'O';

    self.over = self.winner !== undefined || _.keys(self.board).length === 9;
  }

  Game.prototype.play = function(move) {
    if (this.over) return this;

    var updatedBoard = _.clone(this.board);
    updatedBoard[move] = updatedBoard[move] || this.turn;

    return new Game(updatedBoard);
  };

  window.Game = Game;
})();
