/**
 * MyAnimator
 * @constructor
 */
class MyAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.animations = [];
        this.copySequence = [];
        this.replayMode = false;
        this.timeOfLastPiece = 0;
        this.currentTime = 0;
    }

    replay() {
        this.copySequence = [];
        this.copySequence = this.orchestrator.gameSequence.moveSequence;
        this.orchestrator.gameSequence.moveSequence = [];
        this.copySequence.reverse();
        this.orchestrator.prepareForMovie();
    }

    replayMove(t) {
        var move = this.copySequence.pop();
        move.startTime = t;
        this.orchestrator.makeMove(move);
        if (this.copySequence.length == 0)
            this.orchestrator.replayMode = false;
    }

    display() {
        let sequence = this.orchestrator.gameSequence.moveSequence;
        for (let i = 0; i < sequence.length; i++) {
            this.orchestrator.scene.pushMatrix();
            if (this.animations[i] != null)
                this.orchestrator.scene.translate(...this.animations[i]);
            else
                this.orchestrator.scene.translate(...sequence[i].piece.translation);

            sequence[i].piece.display();
            this.orchestrator.scene.popMatrix();
        }
    }

    endReplay()
    {
        while(this.copySequence.length != 0)
        {
            this.replayMove(this.currentTime);
        }
    }

    timeForNextPiece(t)
    {
        if(t - this.timeOfLastPiece > 1000)
        {
            this.timeOfLastPiece = t;
            return true;
        }
        return false;
    }

    update(t) {
        this.currentTime = t;
        if(this.orchestrator.replayMode && this.timeForNextPiece(t)) {
            this.replayMove(t);
        }
        this.animations = [];
        let sequence = this.orchestrator.gameSequence.moveSequence;

        for (let i = 0; i < sequence.length; i++) {
            let timePassed = (t - sequence[i].startTime) / 1000;
            let up = 0;
            (timePassed < 0.5) ? up = 1: up = 0;
            if (timePassed < 1) {
                let interpolatedTime = 1 - timePassed;

                if (up) {
                    var easing = Math.sqrt(1 - Math.pow(timePassed - 1, 2));
                } else {
                    var easing = Math.sqrt(1 - Math.pow(interpolatedTime - 1, 2));
                }

                let auxPieceTranslation = sequence[i].piece.translation.map(x => x * (interpolatedTime));
                let auxTileTranslation = sequence[i].tile.translation.map(x => x * (timePassed));

                var translationWithoutEasing = [auxTileTranslation[0] + auxPieceTranslation[0], easing * 5, auxTileTranslation[2] + auxPieceTranslation[2]];


            } else {
                var translationWithoutEasing = sequence[i].tile.translation;
            }

            this.animations.push(translationWithoutEasing);
        }
    }

}
