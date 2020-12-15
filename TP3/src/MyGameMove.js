/**
 * MyGameMove
 * @constructor
 */
class MyGameMove{
	constructor(piece, tile) {
        this.tile = tile;
        this.piece = piece;
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

