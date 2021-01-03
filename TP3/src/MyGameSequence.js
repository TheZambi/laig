/**
 * MyGameSequence
 * @constructor
 */
class MyGameSequence{
	constructor() {
        this.moveSequence = []; // saves the sequence of moves done for undo/movie
        this.colorSequence = []; // saves the sequence of colors won for undo/movie
	}

    addMove(move, colors) // adds a new move and the colors that were won by that movie
    {
        this.moveSequence.push(move);
        this.colorSequence.push(colors);
    }

    undo(board) // undos a move
    {
        var lastMove = this.moveSequence.pop();
        board.undo(lastMove);
    }

    getLastColors() // return and removes the last combination of colors won
    {
        return this.colorSequence.pop();
    }

}

