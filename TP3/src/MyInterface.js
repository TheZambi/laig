/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        this.scenes = this.gui.add(this.scene.orchestrator, 'theme', this.scene.graphNames).name('Scenes');
        let gameFolder = this.gui.addFolder("Game Controls");
        gameFolder.add(this.scene.orchestrator,'play').name("Start");
        gameFolder.add(this.scene.orchestrator,'reset').name("Reset Game");
        gameFolder.add(this.scene.orchestrator,'replay').name("Play Game Movie");
        gameFolder.add(this.scene.orchestrator,'endReplay').name("Stop Game Movie");
        gameFolder.add(this.scene,'undo').name("Undo");
        gameFolder.add(this.scene.orchestrator, 'gameMode', this.scene.orchestrator.gameModes).name('Gamemode');
        gameFolder.add(this.scene.orchestrator, 'bot1Diff', this.scene.orchestrator.bot1Diffs).name('Bot 1 Difficulty');
        gameFolder.add(this.scene.orchestrator, 'bot2Diff', this.scene.orchestrator.bot2Diffs).name('Bot 2 Difficulty');

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

   
}