/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.torus = new MyTorus(this, 20, 25, 2, 5)

        this.defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));
        this.camera = this.defaultCamera;

        this.sceneInited = false;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);

        this.tileAppearence = new CGFappearance(this);
        this.tileAppearence.loadTexture('./scenes/images/tile.png');

        this.orchestrator = new MyGameOrchestrator(this);

        this.setPickEnabled(true);

        this.cameraList = [];
        this.cameraNames = [];
        this.materialsList = [];
        this.texturesList = [];
        this.animationsList = [];
        this.graphs = [];
        this.graphNames = [];
        this.spriteSheetList = [];
        this.nodesList = [];
        this.spriteAnims = [];
        this.selectedCamera = -1;
        this.lastCamera = -1;
        this.animateCamera = false;
        this.animationCameraTimeStart = 0;
        this.firstCamera = null;
        this.nextCamera = null;
        this.currentPickIndex = 1;
        this.light1 = true;
        this.light2 = true;
        this.light3 = true;
        this.light4 = true;
        this.light5 = true;
        this.light6 = true;
        this.light7 = true;
        this.light8 = true;
    }

    undo() {
        this.orchestrator.undo();
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        this.orchestrator.parsePicking(obj);

                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        if(this.graph.loadedCameras == undefined){
            this.cameraNames = [];
            this.cameraList = [];
            var auxCamera;
            for (var key in this.graph.cameras) {
                if (this.graph.cameras.hasOwnProperty(key)) {
                    auxCamera = this.graph.cameras[key];
                    if (auxCamera[0] == 0) { // 0 for perspective cameras
                        var cameraToPush = new CGFcamera(...auxCamera.slice(1)); // unpacks the array since 1st position because its reserved for an id
                        this.cameraList.push(cameraToPush);
                        this.cameraNames.push(key);
                    }
                    else if (auxCamera[0] == 1) { // 1 for ortho cameras
                        var cameraToPush = new CGFcameraOrtho(...auxCamera.slice(1));// unpacks the array since 1st position because its reserved for an id
                        this.cameraList.push(cameraToPush);
                        this.cameraNames.push(key);
                    }
                    if (key == this.graph.defaultCam) {
                        // copies the default camera to a seperate variable
                        var far = this.cameraList[this.cameraList.length - 1].far;
                        var fov = this.cameraList[this.cameraList.length - 1].fov;
                        var near = this.cameraList[this.cameraList.length - 1].near;
                        var position = this.cameraList[this.cameraList.length - 1].position;
                        var target = this.cameraList[this.cameraList.length - 1].target;
                        var up = this.cameraList[this.cameraList.length - 1]._up;
                        this.camera.far = far;
                        this.camera.fov = fov;
                        this.camera.near = near;
                        this.camera._up = up;
                        this.camera.setPosition(position);
                        this.camera.setTarget(target);
                        this.firstCamera = this.cameraList[this.cameraList.length - 1];
                        this.selectedCamera = key;
                        this.interface.setActiveCamera(this.camera);
                        this.lastCamera = this.cameraList.length - 1;
                    }
                }
            }
            // saves the cameras for the scene in order to not load them again when changing back to the scene
            this.graph.loadedCameras = this.cameraList;
            this.graph.cameraNames = this.cameraNames;
        }
        else{
            // loads the saved cameras for the correct scene
            this.cameraList = this.graph.loadedCameras;
            this.cameraNames = this.graph.cameraNames;
            var i=0;
            for (var key in this.graph.cameras) {
                if (this.graph.cameras.hasOwnProperty(key)) {
                    if (key == this.graph.defaultCam) {
                        // copies the default camera to a seperate variable
                        var orthoCam = false;
                        if(this.cameraList[i] instanceof CGFcameraOrtho){
                            orthoCam = true;
                        }
                        var far = this.cameraList[i].far;
                        if(!orthoCam)
                            var fov = this.cameraList[i].fov;
                        var near = this.cameraList[i].near;
                        var position = this.cameraList[i].position;
                        var target = this.cameraList[i].target;
                        var up = this.cameraList[i]._up;
                        if(orthoCam){
                            this.camera = new CGFcameraOrtho(-50,50,-50,50,0.1,500,vec3.fromValues(50,20,60),vec3.fromValues(5,0,0),vec3.fromValues(0,1,0));
                        }
                        this.camera.far = far;
                        if(!orthoCam)
                            this.camera.fov = fov;
                        this.camera.near = near;
                        this.camera._up = up;
                        this.camera.setPosition(position);
                        this.camera.setTarget(target);
                        this.firstCamera = this.cameraList[i];
                        this.selectedCamera = key;
                        this.interface.setActiveCamera(this.camera);
                        this.lastCamera = i;
                        break;
                    }
                }
                i++;
            }
        }

        this.interface.cameraFolder = this.interface.gui.addFolder("Cameras");
        var controller = this.interface.cameraFolder.add(this, 'selectedCamera', this.cameraNames).name('Selected Camera');
        controller.onChange(this.updateCamera.bind(this));
        return;
    }

    /**
     * Updates the current selected camera
     */
    updateCamera() {
        if (this.selectedCamera != -1 && this.selectedCamera != this.lastCamera) {
            this.firstCamera = this.camera;
            for (let i = 0; i < this.cameraNames.length; i++) {
                if (this.selectedCamera == this.cameraNames[i]) {
                    this.nextCamera = this.cameraList[i];
                    this.animateCamera = true;
                    this.animationCameraTimeStart = this.orchestrator.currentTime;
                    break;
                }
            }
            this.lastCamera = this.selectedCamera;
        }
    }

    interpolateCams(t) {
        //if the next cam is ortho proper mesures need to be taken. For example, if the current camera isn't ortho we need to create a new one to take its place
        var nextIsOrtho = false; 
        if(this.nextCamera instanceof CGFcameraOrtho){
            nextIsOrtho = true;
        }
        var firstIsOrtho = false;
        if(this.firstCamera instanceof CGFcameraOrtho){
            firstIsOrtho = true;
        }
        
        var timePassed = (t - this.animationCameraTimeStart) / 1000;
        if (timePassed >= 1) {
            this.animateCamera = false;
            timePassed = 1;
        }

        // series of operations to interpolate the cameras to create an animation of a camera sliding between two positions
        var far = this.firstCamera.far * (1 - timePassed) + this.nextCamera.far * (timePassed);
        if(!firstIsOrtho && !nextIsOrtho) //since ortho cams don't have a fov, these bools indicate whether to interpolate it or not
            var fov = this.firstCamera.fov * (1 - timePassed) + this.nextCamera.fov * (timePassed);
        var near = this.firstCamera.near * (1 - timePassed) + this.nextCamera.near * (timePassed);
        var position = [];
        var target = [];
        var upAux = [];
        for (let i = 0; i < this.firstCamera.position.length - 1; i++) {
            var positionToPush = this.firstCamera.position[i] * (1 - timePassed) + this.nextCamera.position[i] * (timePassed);
            var targetToPush = this.firstCamera.target[i] * (1 - timePassed) + this.nextCamera.target[i] * (timePassed);
            var upToPush = this.firstCamera._up[i] * (1 - timePassed) + this.nextCamera._up[i] * (timePassed);
            position.push(positionToPush);
            target.push(targetToPush);
            upAux.push(upToPush);
        }

        var up = vec4.create();

        vec4.normalize(up, vec4.fromValues(upAux[0], upAux[1], upAux[2], 0)); // the _up argument must be normalized

        //RESET CAMERAS WHEN FINISHED
        if (timePassed == 1) {
            if(!nextIsOrtho){
                this.camera = this.defaultCamera;
                this.firstCamera = this.nextCamera;
                this.nextCamera = null;
            }
            else{
                //in order to create a proper ortho camera the current camera must be overwritten
                this.camera = new CGFcameraOrtho(-50,50,-50,50,0.1,500,vec3.fromValues(50,20,60),vec3.fromValues(5,0,0),vec3.fromValues(0,1,0));
            }
        }
        this.camera.far = far;
        if(!firstIsOrtho && !nextIsOrtho)
            this.camera.fov = fov;
        this.camera.near = near;
        this.camera._up = up;
        this.camera.setPosition(position);
        this.camera.setTarget(target);

        this.interface.setActiveCamera(this.camera);
    }
    /**
     * Intiializes all nodes and fills their respective descendants node
     */
    initNodes() {
        this.nodesList = [];
        for (var key in this.graph.nodes) {
            if (this.graph.nodes.hasOwnProperty(key)) {
                var auxNode = this.graph.nodes[key];
                for (let values = 0; values < auxNode[3].length; values++) {
                    if (auxNode[3][values][0] == "node") {
                        if (!(this.graph.nodes.hasOwnProperty(auxNode[3][values][1])))
                            this.graph.onXMLError("descendant node " + auxNode[3][values][1] + " from parent node " + key + " does not exist.");
                    }
                }
                var nodeToPush = new MyNode(this, key, auxNode);
                this.nodesList.push(nodeToPush);
            }
        }

        //fills children of all nodes since now they are all created
        for (let i = 0; i < this.nodesList.length; i++) {
            if (this.nodesList[i].id == this.graph.idRoot && this.nodesList[i].visited == false) {
                this.addChildren(this.nodesList[i])
            }
        }

        for (let i = 0; i < this.nodesList.length; i++) {
            for (let j = 0; j < this.nodesList[i].animSprites.length; j++) {
                this.nodesList[i].animSprites[j].spriteSheet = this.spriteSheetList[this.nodesList[i].animSprites[j].spriteSheetID];
            }
        }

        this.initSpriteAnims();
    }

    /**
     * Initializes the animated sprites
     */
    initSpriteAnims() {
        this.spriteAnims = [];
        for (let i = 0; i < this.nodesList.length; i++)
            for (let j = 0; j < this.nodesList[i].animSprites.length; j++) {
                this.spriteAnims.push(this.nodesList[i].animSprites[j]);
                this.nodesList[i].animSprites[j].updateNSteps();
            }
    }

    /**
     * Fills node's descendant node
     * @param {*} node - Node to fill 
     */
    addChildren(node) {
        node.visited = true;
        for (let i = 0; i < this.nodesList.length; i++) {
            if (node.childrenNames.includes(this.nodesList[i].id)) {
                node.children.push(this.nodesList[i]);
                this.addChildren(this.nodesList[i]);
            }
        }
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        var lightName = [];
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.
            if (this.graph.lights.hasOwnProperty(key)) {
                lightName.push(key);

                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0]) {

                    this.lights[i].enable();
                    this['light' + (i + 1)] = true;
                }
                else {
                    this.lights[i].disable();
                    this['light' + (i + 1)] = false;
                }

                this.lights[i].update();
                i++;
            }
        }


        this.nLights = i;
        //Adds lights to the interface so we can turn them on and off
        this.interface.lightsFolder = this.interface.gui.addFolder("Lights");
        for (let j = 1; j <= this.nLights; j++) {
            this.interface.lightsFolder.add(this, 'light' + j).name(lightName[j - 1]).onChange(this.updateLights.bind(this));
        }

    }

    /**
     * updates the lights gui
     */
    updateLights() {
        for (let j = 1; j <= this.nLights; j++) {

            if (this['light' + j] == true)
                this.lights[j - 1].enable();
            else
                this.lights[j - 1].disable();

            this.lights[j - 1].update();
        }

    }

    /**
     * Initializes the materials received from the parser
     */
    initMaterials() {
        if(this.graph.loadedMats == undefined){
            for (var key in this.graph.materials) {
                if (this.graph.materials.hasOwnProperty(key)) {
                    var auxMaterial = this.graph.materials[key];
                    var materialToPush = new CGFappearance(this);
                    materialToPush.setShininess(auxMaterial[0][1]);
                    materialToPush.setAmbient(...auxMaterial[1].slice(1));
                    materialToPush.setDiffuse(...auxMaterial[2].slice(1));
                    materialToPush.setSpecular(...auxMaterial[3].slice(1));
                    materialToPush.setEmission(...auxMaterial[4].slice(1));
                    this.materialsList[key] = materialToPush;
                }
            }
            // saves scene's materials so they are not created again later
            this.graph.loadedMats = this.materialsList;
        }
        else
        {
            // loads scene's materials
            this.materialsList = this.graph.loadedMats;
        }
    }

    /**
     * Initializes the textures received from the parser
     */
    initTextures() {
        if(this.graph.loadedTextures == undefined){
            for (var key in this.graph.textures) {
                if (this.graph.textures.hasOwnProperty(key)) {
                    var auxTexture = this.graph.textures[key];
                    var textureToPush = new CGFtexture(this, auxTexture);
                    this.texturesList[key] = textureToPush;
                }
            }
            // saves scene's textures so they are not loaded again later
            this.graph.loadedTextures = this.texturesList;
        }
        else{
            // loads scene's textures
            this.texturesList = this.graph.loadedTextures;
        }
    }

    /**
     * Fills material field of node
     */
    addMaterialsToNodes() {
        for (let i = 0; i < this.nodesList.length; i++) {
            this.nodesList[i].material = this.materialsList[this.nodesList[i].materialID];
        }
    }

    /**
     * Fills texture field of node
     */
    addTexturesToNodes() {
        for (let i = 0; i < this.nodesList.length; i++) {
            this.nodesList[i].texture = this.texturesList[this.nodesList[i].textureID];
        }
    }

    /**
    * Initializes the animations received from the parser
    */
    initAnimations() {
        this.animationsList = [];
        for (var key in this.graph.animations) {
            if (this.graph.animations.hasOwnProperty(key)) {
                var auxAnimation = this.graph.animations[key];
                var animationToPush = new KeyFrameAnimation(auxAnimation);
                this.animationsList[key] = animationToPush;
            }
        }
    }
    /**
    * Initializes the spriteSheets received from the parser
    */
    initSpriteSheets() {
        if(this.graph.loadedSpritesheets == undefined){
            for (var key in this.graph.spriteSheets) {
                if (this.graph.spriteSheets.hasOwnProperty(key)) {
                    var auxSpriteSheet = this.graph.spriteSheets[key];
                    var spriteSheetsToPush = new MySpriteSheet(this, ...auxSpriteSheet);
                    this.spriteSheetList[key] = spriteSheetsToPush;
                }
            }
            this.graph.loadedSpritesheets = this.spriteSheetList;
        }
        else{
            this.spriteSheetList = this.graph.loadedSpritesheets;
        }

    }
    /**
     * Fills texture field of node
     */
    addAnimationsToNodes() {
        for (let i = 0; i < this.nodesList.length; i++) {
            this.nodesList[i].animation = this.animationsList[this.nodesList[i].animationID];
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded(curGraph) {
        if (this.interface.scenes)
            this.interface.scenes.remove();

        if (curGraph.firstScene) {
            this.axis = new CGFaxis(this, curGraph.referenceLength);

            this.gl.clearColor(...curGraph.background);

            this.setGlobalAmbientLight(...curGraph.ambient);

            this.initLights();
            this.initCameras();
            this.initSpriteSheets();
            this.initNodes();
            this.initMaterials();
            this.initTextures();
            this.initAnimations();
            this.addMaterialsToNodes();
            this.addTexturesToNodes();
            this.addAnimationsToNodes();

            this.textSheet = new MySpriteSheet(this, new CGFtexture(this, './src/textSheet.png'), 16, 16);
            this.setUpdatePeriod(100);

            this.texStack = [];
            this.matStack = [new CGFappearance(this)];

            if (this.nodesList[0] != null)
                this.nodesList[0].updateCoords();

            this.orchestrator.theme = curGraph.name;

            this.orchestrator.boardTranslation = curGraph.boardTranslation;

            this.sceneInited = true;
        }

        this.interface.scenes = this.interface.gui.add(this.orchestrator, 'theme', this.graphNames).name('Scenes').onChange(this.updateTheme.bind(this));
    }

    updateTheme() {
        for(let i = 0;i< this.lights.length;i++){
            this.lights[i].disable();
            this.lights[i].update();
        }

        this.interface.gui.removeFolder(this.interface.cameraFolder);
        this.interface.gui.removeFolder(this.interface.lightsFolder);
        var index = 0;
        for (let i = 0; i < this.graphNames.length; i++) {
            if (this.orchestrator.theme == this.graphNames[i]) {
                index = i;
                break;
            }
        }

        this.graph = this.graphs[index];

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();
        this.initCameras();
        this.interface.gui.remove(this.interface.scenes);
        this.interface.scenes = this.interface.gui.add(this.orchestrator, 'theme', this.graphNames).name('Scenes').onChange(this.updateTheme.bind(this));
        this.initSpriteSheets();
        this.initNodes();
        this.initMaterials();
        this.initTextures();
        this.initAnimations();
        this.addMaterialsToNodes();
        this.addTexturesToNodes();
        this.addAnimationsToNodes();

        this.texStack = [];
        this.matStack = [new CGFappearance(this)];

        if (this.nodesList[0] != null)
            this.nodesList[0].updateCoords();

        this.orchestrator.theme = this.graph.name;
        this.orchestrator.boardTranslation = this.graph.boardTranslation;

        // this.sceneInited = true;
    }

    update(t) {
        if (this.animateCamera) {
            this.interpolateCams(t);
        }
        for (var key in this.animationsList) {
            this.animationsList[key].update(t);
        }
        for (let i = 0; i < this.spriteAnims.length; i++) {
            this.spriteAnims[i].update(t);
        }
        this.orchestrator.update(t);
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene

        this.logPicking();
        this.clearPickRegistration();
        this.currentPickIndex = 1;

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.updateLights();

        this.pushMatrix();



        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            this.orchestrator.orchestrate();
        }
        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}