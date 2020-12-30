class MyPrologInterface {
    /**
     * @method constructor
     */
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    requestColorsWon(requestString) {
        this.getPrologRequest(requestString, this.updateColors.bind(this.orchestrator));
    }

    requestBotMove(requestString){
        this.getPrologRequest(requestString, this.botMove.bind(this.orchestrator));
        console.log(requestString);
    }


    botMove(data){
        this.parseBotMove(data.target.response.replace('[','').replace(']','').split(','));
    }

    //Handle the Reply
    updateColors(data) {
        let returnVal = data.target.response;
        this.colorsWon = returnVal.replace('[','').replace(']','').split(',');
        this.gameboard.player0Score.updateColors(this.colorsWon);
        this.gameboard.player1Score.updateColors(this.colorsWon);
        this.checkFinish(); 
    }
}

