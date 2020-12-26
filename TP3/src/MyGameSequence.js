/**
 * MyGameSequence
 * @constructor
 */
class MyGameSequence{
	constructor() {
        this.moveSequence = [];
        this.colorSequence = [];
	}

    addMove(move, colors)
    {
        this.moveSequence.push(move);
        this.colorSequence.push(colors);
    }

    undo(board)
    {
        var lastMove = this.moveSequence.pop();
        board.undo(lastMove);
    }

    getLastColors()
    {
        return this.colorSequence.pop();
    }

}

