/**
 * MyGameMove
 * @constructor
 */
class MyGameMove{
	constructor(piece, tile, startTime) {
        this.tile = tile;
        this.piece = piece;
        this.startTime = startTime;
	}

    /**
     * @method getTile
     * Gets the tile of this move
     */
    getTile()
    {
        return this.tile;
    }

    /**
     * @method getPiece
     * Gets the piece of this move
     */
    getPiece()
    {
        return this.piece;
    }

    /**
     * @method getColor
     * Gets the color of this move
     */
    getColor()
    {
        return this.piece.color;
    }


}

