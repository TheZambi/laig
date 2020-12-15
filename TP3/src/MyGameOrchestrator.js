/**
 * MyGameOrchestrator
 * @constructor
 */
class MyGameOrchestrator{
	constructor(scene) {
        this.scene = scene;
        // this.animator = new MyAnimator(…);
        // this.prolog = new MyPrologInterface(…);
        // this.theme = new MyScenegraph(…);
        this.selectedPiece = null;
        this.gameSequence = new MyGameSequence();
        this.gameboard = new MyGameBoard(scene);
	}

    display()
    {
        this.gameboard.display();
    }

    parsePicking(obj)
    {
        if(obj instanceof MyPiece)
        {
            console.log(obj.color);
            this.selectedPiece = obj;
        }
        else if(obj instanceof MyTile && this.selectedPiece != null)
        {
            if(obj.piece == null){
                var newMove = new MyGameMove(this.selectedPiece, obj)
                this.gameboard.movePiece(newMove);
                this.gameSequence.addMove(newMove);
                this.selectedPiece = null;
            }
        }
    }

}

