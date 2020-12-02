/**
 * MyGameSequence
 * @constructor
 */
class MyGameSequence{
	constructor() {
        this.sequence = [];
	}

    addMove(move)
    {
        this.sequence.push(move);
    }

    undo(board)
    {
        var lastMove = this.sequence.pop;
        board.undo(lastMove);
    }

}

