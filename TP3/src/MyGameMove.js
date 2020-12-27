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

    getTile()
    {
        return this.tile;
    }

    getPiece()
    {
        return this.piece;
    }

    getColor()
    {
        return this.piece.color;
    }

    animate()
    {
        this.piece.animate();
    }

}

