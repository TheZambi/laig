const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }
        // <spritSheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
            if ((error = this.parseSpriteSheets(nodes[index])) != null)
                return error;
        }


        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1){
            this.onXMLMinorError("tag <animations> missing");
            NODES_INDEX--;
        }
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse materials block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        this.cameras = [];

        this.defaultCam = this.reader.getString(viewsNode, 'default');


        var perspective;
        var ortho;
        var aux = [];

        for (let i = 0; i < children.length; i++) {
            //parses perspective cam
            if (children[i].nodeName == 'perspective') {
                perspective = children[i];
                var id, near, far, angle;
                id = this.reader.getString(perspective, 'id');
                if (id == null)
                    return "camera has no id";

                near = this.reader.getFloat(perspective, 'near');
                if (near == null)
                    return "camera " + id + " has no atribute near";

                far = this.reader.getFloat(perspective, 'far');
                if (far == null)
                    return "camera " + id + " has no atribute far";

                angle = this.reader.getFloat(perspective, 'angle');
                if (angle == null)
                    return "camera " + id + " has no atribute angle";

                var perspectiveChildren = children[i].children;
                var perspectiveChildrenArray = [];
                for (let i = 0; i < perspectiveChildren.length; i++) {
                    perspectiveChildrenArray.push(perspectiveChildren[i].nodeName);
                }

                var fromIndex = perspectiveChildrenArray.indexOf('from');
                if (fromIndex == -1)
                    return "no fromIndex on view " + id;

                var toIndex = perspectiveChildrenArray.indexOf('to');
                if (toIndex == -1)
                    return "no toIndex on view " + id;

                var fromPosX, fromPosY, fromPosZ;
                var toPosX, toPosY, toPosZ;
                fromPosX = this.reader.getFloat(perspectiveChildren[fromIndex], 'x');
                if (fromPosX == null)
                    return "no x coord on 'from' on view " + id;

                fromPosY = this.reader.getFloat(perspectiveChildren[fromIndex], 'y');
                if (fromPosY == null)
                    return "no y coord on 'from' on view " + id;

                fromPosZ = this.reader.getFloat(perspectiveChildren[fromIndex], 'z');
                if (fromPosZ == null)
                    return "no z coord on 'from' on view " + id;

                toPosX = this.reader.getFloat(perspectiveChildren[toIndex], 'x');
                if (toPosX == null)
                    return "no x coord on 'to' on view " + id;

                toPosY = this.reader.getFloat(perspectiveChildren[toIndex], 'y');
                if (toPosY == null)
                    return "no y coord on 'to' on view " + id;

                toPosZ = this.reader.getFloat(perspectiveChildren[toIndex], 'z');
                if (toPosZ == null)
                    return "no z coord on 'to' on view " + id;
                var newAngle = angle * DEGREE_TO_RAD;
                aux.push(0, newAngle, near, far, vec3.fromValues(fromPosX, fromPosY, fromPosZ), vec3.fromValues(toPosX, toPosY, toPosZ));
                this.cameras[id] = aux;
                aux = [];
            } //parses ortho cam
            else if (children[i].nodeName == 'ortho') {
                ortho = children[i];
                var id, near, far, left, right, top, bottom;

                id = this.reader.getString(ortho, 'id');
                if (id == null)
                    return "camera has no id";

                near = this.reader.getFloat(ortho, 'near');
                if (near == null)
                    return "camera " + id + " has no atribute near";

                far = this.reader.getFloat(ortho, 'far');
                if (far == null)
                    return "camera " + id + " has no atribute far";

                left = this.reader.getFloat(ortho, 'left');
                if (left == null)
                    return "camera " + id + " has no atribute left";

                right = this.reader.getFloat(ortho, 'right');
                if (right == null)
                    return "camera " + id + " has no atribute right";

                top = this.reader.getFloat(ortho, 'top');
                if (top == null)
                    return "camera " + id + " has no atribute top";

                bottom = this.reader.getFloat(ortho, 'bottom');
                if (bottom == null)
                    return "camera " + id + " has no atribute bottom";


                var orthoChildren = children[i].children;
                var orthoChildrenArray = [];
                for (let i = 0; i < orthoChildren.length; i++) {
                    orthoChildrenArray.push(orthoChildren[i].nodeName);
                }

                var fromIndex = orthoChildrenArray.indexOf('from');
                if (fromIndex == -1)
                    return "no fromIndex on view " + id;

                var toIndex = orthoChildrenArray.indexOf('to');
                if (toIndex == -1)
                    return "no toIndex on view " + id;

                var upIndex = orthoChildrenArray.indexOf('up');

                var fromPosX, fromPosY, fromPosZ;
                var toPosX, toPosY, toPosZ;
                var upPosX, upPosY, upPosZ;
                fromPosX = this.reader.getFloat(orthoChildren[fromIndex], 'x');
                if (fromPosX == null)
                    return "no x coord on 'from' on view " + id;

                fromPosY = this.reader.getFloat(orthoChildren[fromIndex], 'y');
                if (fromPosY == null)
                    return "no y coord on 'from' on view " + id;

                fromPosZ = this.reader.getFloat(orthoChildren[fromIndex], 'z');
                if (fromPosZ == null)
                    return "no z coord on 'from' on view " + id;

                toPosX = this.reader.getFloat(orthoChildren[toIndex], 'x');
                if (toPosX == null)
                    return "no x coord on 'to' on view " + id;

                toPosY = this.reader.getFloat(orthoChildren[toIndex], 'y');
                if (toPosY == null)
                    return "no y coord on 'to' on view " + id;

                toPosZ = this.reader.getFloat(orthoChildren[toIndex], 'z');
                if (toPosZ == null)
                    return "no z coord on 'to' on view " + id;

                if (upIndex != -1) {
                    upPosX = this.reader.getFloat(orthoChildren[upIndex], 'x');
                    upPosY = this.reader.getFloat(orthoChildren[upIndex], 'y');
                    upPosZ = this.reader.getFloat(orthoChildren[upIndex], 'z');
                }
                if (upPosX == null) {
                    upPosX = 0;
                }
                if (upPosY == null) {
                    upPosX = 1;
                }
                if (upPosY == null) {
                    upPosX = 0;
                }
                aux.push(1.0, left, right, bottom, top, near, far, vec4.fromValues(fromPosX, fromPosY, fromPosZ, 1), vec4.fromValues(toPosX, toPosY, toPosZ, 1), vec3.fromValues(upPosX, upPosY, upPosZ));
                this.cameras[id] = aux;
                aux = [];
            } else
                return "no camera corresponds to " + children[i].nodeName;
        }


        this.log("Parsed Views");

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <spriteSheest> block. 
     * @param {spriteSheets block element} spriteSheetNodes
     */
    parseSpriteSheets(spriteSheetNodes) {

        //For each spriteSheet in spriteSheet block, check ID, file path, sizeM and sizeN

        var children = spriteSheetNodes.children;

        this.spriteSheets = [];

        // Any number of spriteSheets.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current spriteSheet.
            var spriteSheetID = this.reader.getString(children[i], 'id');
            if (spriteSheetID == null)
                return "no ID defined for spriteSheet";

            // Checks for repeated IDs.
            if (this.spriteSheets[spriteSheetID] != null)
                return "ID must be unique for each spriteSheet (conflict: ID = " + spriteSheetID + ")";

            var spriteSheetPath = this.reader.getString(children[i], 'path');

            if (spriteSheetPath == null)
                return "no Path defined for spriteSheet " + spriteSheetID;

            //verifying if spriteSheet exists

            var http = new XMLHttpRequest();
            http.open('HEAD', spriteSheetPath, false);
            http.send();

            if (!(http.status === 200))
                return "No texture found on path: " + spriteSheetPath;


            var sizeM = this.reader.getInteger(children[i], "sizeM");
            if (sizeM == null)
                return "missing sizeM value on spriteSheet " + spriteSheetID;

            var sizeN = this.reader.getInteger(children[i], "sizeN");
            if (sizeN == null)
                return "missing sizeN value on spriteSheet " + spriteSheetID;

            this.spriteSheets[spriteSheetID] = [new CGFtexture(this.scene,spriteSheetPath), sizeM, sizeN];
            
        }
        this.log("Parsed spriteSheets");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL

        // this.onXMLMinorError("To do: Parse textures.");
        var children = texturesNode.children;

        this.textures = [];

        // Any number of texture.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            var texturePath = this.reader.getString(children[i], 'path');

            if (texturePath == null)
                return "no Path defined for texture " + textureID;

            //verifying if texture exists

            var http = new XMLHttpRequest();
            http.open('HEAD', texturePath, false);
            http.send();

            if (!(http.status === 200))
                return "No texture found on path: " + texturePath;


            this.textures[textureID] = texturePath;
        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <animations> node.
     * @param {animations block element} animationSNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];
        // Any number of animations.
        for (var i = 0; i < children.length; i++) {
            var auxArray = [];
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";


            var grandChildren = [];
            grandChildren = children[i].children;


            for (let l = 0; l < grandChildren.length; l++) {
                var instant = this.reader.getString(grandChildren[l], "instant");
                var grandChildrenArray = [];
                for (let j = 0; j < grandChildren[l].children.length; j++) {             
                    // grandChildrenArray.push(grandChildren[i].nodeName);
                    grandChildrenArray.push(grandChildren[l].children[j].nodeName);
                }

                var translationIndex = -1,
                    rotationXIndex = -1,
                    rotationYIndex = -1,
                    rotationZIndex = -1,
                    scaleIndex = -1;
                for (let k = 0; k < grandChildrenArray.length; k++) {
                    if (grandChildrenArray[k] == "translation") {
                        translationIndex = k;
                    }
                    if (grandChildrenArray[k] == "scale") {
                        scaleIndex = k;
                    }
                    if (grandChildrenArray[k] == "rotation") {
                        var axis = this.reader.getString(grandChildren[l].children[k], "axis");
                        if (axis == "x")
                            rotationXIndex = k;
                        if (axis == "y")
                            rotationYIndex = k;
                        if (axis == "z")
                            rotationZIndex = k;
                    }
                }

                if (translationIndex == -1)
                    return "no translation defined for animation " + animationID;

                if (scaleIndex == -1)
                    return "no scale defined for animation " + animationID;

                if (rotationXIndex == -1)
                    return "no rotationX defined for animation " + animationID;

                if (rotationYIndex == -1)
                    return "no rotationY defined for animation " + animationID;

                if (rotationZIndex == -1)
                    return "no rotationZ defined for animation " + animationID;

                var translationVals = ["translation"];
                var rotationXVals = ["rotationX"];
                var rotationYVals = ["rotationY"];
                var rotationZVals = ["rotationZ"];
                var scaleVals = ["scale"];


                //Animation Translation
                var aux = this.reader.getFloat(grandChildren[l].children[translationIndex], "x");
                if (aux == null)
                    return "missing X value on translation on animation " + animationID;

                translationVals.push(aux);

                aux = this.reader.getFloat(grandChildren[l].children[translationIndex], "y");
                if (aux == null)
                    return "missing Y value on translation on animation " + animationID;

                translationVals.push(aux);

                aux = this.reader.getFloat(grandChildren[l].children[translationIndex], "z");
                if (aux == null)
                    return "missing Z value on translation on animation " + animationID;

                translationVals.push(aux);

                //Animation Rotation
                aux = this.reader.getFloat(grandChildren[l].children[rotationXIndex], "angle");
                if (aux == null)
                    return "missing angle value on rotationX on animation " + animationID;

                rotationXVals.push(aux);

                aux = this.reader.getFloat(grandChildren[l].children[rotationYIndex], "angle");
                if (aux == null)
                    return "missing angle value on rotationY on animation " + animationID;

                rotationYVals.push(aux);

                aux = this.reader.getFloat(grandChildren[l].children[rotationZIndex], "angle");
                if (aux == null)
                    return "missing angle value on rotationZ on animation " + animationID;

                rotationZVals.push(aux);

                //Animation Scale
                var aux = this.reader.getFloat(grandChildren[l].children[scaleIndex], "sx");
                if (aux == null)
                    return "missing X value on scale on animation " + animationID;

                scaleVals.push(aux);

                aux = this.reader.getFloat(grandChildren[l].children[scaleIndex], "sy");
                if (aux == null)
                    return "missing Y value on scale on animation " + animationID;

                scaleVals.push(aux);

                aux = this.reader.getFloat(grandChildren[l].children[scaleIndex], "sz");
                if (aux == null)
                    return "missing Z value on scale on animation " + animationID;

                scaleVals.push(aux);

                var instantAux = ["instant"];
                instantAux.push(instant);
                auxArray.push([instantAux, translationVals, rotationXVals, rotationYVals, rotationZVals, scaleVals]);
            }
            this.animations[animationID] = auxArray;
        }
        this.log("Parsed animations");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            var aux = [];
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";


            var grandChildren = [];
            grandChildren = children[i].children;


            var grandChildrenArray = [];
            for (let i = 0; i < grandChildren.length; i++) {
                grandChildrenArray.push(grandChildren[i].nodeName);
            }
            var shininessIndex, ambientIndex, diffuseIndex, specularIndex, emissiveIndex;

            shininessIndex = grandChildrenArray.indexOf("shininess");
            if (shininessIndex == -1)
                return "no shininessIndex defined for material " + materialID;

            ambientIndex = grandChildrenArray.indexOf("ambient");
            if (ambientIndex == -1)
                return "no ambientIndex defined for material " + materialID;

            diffuseIndex = grandChildrenArray.indexOf("diffuse");
            if (diffuseIndex == -1)
                return "no diffuseIndex defined for material " + materialID;

            specularIndex = grandChildrenArray.indexOf("specular");
            if (specularIndex == -1)
                return "no specularIndex defined for material " + materialID;

            emissiveIndex = grandChildrenArray.indexOf("emissive");
            if (emissiveIndex == -1)
                return "no emissiveIndex defined for material " + materialID;

            var shininessRGBA = ["shininess"];
            var ambientRGBA = ["ambient"];
            var diffuseRGBA = ["diffuse"];
            var specularRGBA = ["specular"];
            var emissiveRGBA = ["emissive"];

            if (this.reader.getFloat(grandChildren[shininessIndex], "value") == null)
                return "missin shininess value on material " + materialID;

            shininessRGBA.push(this.reader.getFloat(grandChildren[shininessIndex], "value"))

            var rVal = this.reader.getFloat(grandChildren[ambientIndex], "r");
            var gVal = this.reader.getFloat(grandChildren[ambientIndex], "g");
            var bVal = this.reader.getFloat(grandChildren[ambientIndex], "b");
            var aVal = this.reader.getFloat(grandChildren[ambientIndex], "a");

            if (rVal == null || gVal == null || bVal == null || aVal == null)
                return "missing argument on ambient reflexion on material " + materialID;

            ambientRGBA.push(rVal);
            ambientRGBA.push(gVal);
            ambientRGBA.push(bVal);
            ambientRGBA.push(aVal);

            var rVal = this.reader.getFloat(grandChildren[diffuseIndex], "r");
            var gVal = this.reader.getFloat(grandChildren[diffuseIndex], "g");
            var bVal = this.reader.getFloat(grandChildren[diffuseIndex], "b");
            var aVal = this.reader.getFloat(grandChildren[diffuseIndex], "a");

            if (rVal == null || gVal == null || bVal == null || aVal == null)
                return "missing argument for difuse reflexion on material " + materialID;

            diffuseRGBA.push(rVal);
            diffuseRGBA.push(gVal);
            diffuseRGBA.push(bVal);
            diffuseRGBA.push(aVal);

            var rVal = this.reader.getFloat(grandChildren[specularIndex], "r");
            var gVal = this.reader.getFloat(grandChildren[specularIndex], "g");
            var bVal = this.reader.getFloat(grandChildren[specularIndex], "b");
            var aVal = this.reader.getFloat(grandChildren[specularIndex], "a");

            if (rVal == null || gVal == null || bVal == null || aVal == null)
                return "missing argument for specular reflexion on material " + materialID;

            specularRGBA.push(rVal);
            specularRGBA.push(gVal);
            specularRGBA.push(bVal);
            specularRGBA.push(aVal);

            var rVal = this.reader.getFloat(grandChildren[emissiveIndex], "r");
            var gVal = this.reader.getFloat(grandChildren[emissiveIndex], "g");
            var bVal = this.reader.getFloat(grandChildren[emissiveIndex], "b");
            var aVal = this.reader.getFloat(grandChildren[emissiveIndex], "a");

            if (rVal == null || gVal == null || bVal == null || aVal == null)
                return "missing argument for emissive reflexion on material " + materialID;

            emissiveRGBA.push(rVal);
            emissiveRGBA.push(gVal);
            emissiveRGBA.push(bVal);
            emissiveRGBA.push(aVal);

            aux.push(shininessRGBA, ambientRGBA, diffuseRGBA, specularRGBA, emissiveRGBA);
            this.materials[materialID] = aux;

        }
        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <nodes> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var animationIndex = nodeNames.indexOf("animationref");
            var descendantsIndex = nodeNames.indexOf("descendants");

            var aux = [];

            // Material
            if (materialIndex != -1)
                aux.push(this.reader.getString(grandChildren[materialIndex], "id"));
            else {
                this.onXMLMinorError("No material set for node " + nodeID + " setting white material as default.");
            }

            // Texture
            if (textureIndex != -1) {
                var textAmplification = grandChildren[textureIndex].children;
                var textureAux = [];

                textureAux.push(this.reader.getString(grandChildren[textureIndex], "id"));

                textureAux.push(this.reader.getFloat(textAmplification[0], "afs"));
                textureAux.push(this.reader.getFloat(textAmplification[0], "aft"));
                aux.push(textureAux);
            } else //if there is no texture, texture "clear" is set as default
            {
                this.onXMLMinorError("No texture set for node " + nodeID + " setting clear texture as default.");
                var textureAux = [];
                textureAux.push("clear");
                textureAux.push(1.0, 1.0);
                aux.push(textureAux);
            }


            // Transformations
            var transformationAux = [];
            if (transformationsIndex != -1) {
                var transformations = grandChildren[transformationsIndex].children;

                for (let i = 0; i < transformations.length; i++) {
                    var singleTransformation = [];

                    if (transformations[i].nodeName == "translation") // t
                    {
                        singleTransformation.push("t");
                        singleTransformation.push(this.reader.getFloat(transformations[i], "x"));
                        singleTransformation.push(this.reader.getFloat(transformations[i], "y"));
                        singleTransformation.push(this.reader.getFloat(transformations[i], "z"));

                    } else if (transformations[i].nodeName == "rotation") // r
                    {
                        singleTransformation.push("r");
                        singleTransformation.push(this.reader.getString(transformations[i], "axis"));
                        singleTransformation.push(this.reader.getFloat(transformations[i], "angle"));

                    } else if (transformations[i].nodeName == "scale") // s
                    {
                        singleTransformation.push("s");
                        singleTransformation.push(this.reader.getFloat(transformations[i], "sx"));
                        singleTransformation.push(this.reader.getFloat(transformations[i], "sy"));
                        singleTransformation.push(this.reader.getFloat(transformations[i], "sz"));
                    }
                    transformationAux.push(singleTransformation);

                }
            } else {
                this.onXMLMinorError("No transformation tag on node " + nodeID);
                this.transformationAux = [];
            }
            aux.push(transformationAux);

            // Descendants
            if (descendantsIndex == -1)
                return "No descendants for node with id " + nodeID;

            var descendants = grandChildren[descendantsIndex].children;

            var descendantsParsed = [];
            

            for (let i = 0; i < descendants.length; i++) {
                var descendantsAux = [];

                if (descendants[i].nodeName == "noderef") {
                    descendantsAux.push("node");
                    descendantsAux.push(this.reader.getString(descendants[i], "id"));
                } else if (descendants[i].nodeName == "leaf") {
                    descendantsAux.push("leaf");
                    descendantsAux.push(this.reader.getString(descendants[i], "type"));
                    switch (descendantsAux[1]) {
                        case "rectangle":
                            descendantsAux.push(this.reader.getFloat(descendants[i], "x1"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "y1"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "x2"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "y2"));
                            break;
                        case "sphere":
                            descendantsAux.push(this.reader.getFloat(descendants[i], "slices"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "stacks"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "radius"));
                            break;
                        case "triangle":
                            descendantsAux.push(this.reader.getFloat(descendants[i], "x1"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "y1"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "x2"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "y2"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "x3"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "y3"));
                            break;
                        case "cylinder":
                            descendantsAux.push(this.reader.getFloat(descendants[i], "slices"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "stacks"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "topRadius"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "bottomRadius"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "height"));
                            break;
                        case "torus":
                            descendantsAux.push(this.reader.getFloat(descendants[i], "slices"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "loops"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "inner"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "outer"));
                            break;
                        case "spritetext":
                            descendantsAux.push(this.reader.getString(descendants[i], "text"));
                            break;
                        case "spriteanim":
                            descendantsAux.push(this.reader.getString(descendants[i], "ssid"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "duration"));
                            descendantsAux.push(this.reader.getInteger(descendants[i], "startCell"));
                            descendantsAux.push(this.reader.getInteger(descendants[i], "endCell"));
                            break;
                        case "plane":
                            descendantsAux.push(this.reader.getInteger(descendants[i], "npartsU"));
                            descendantsAux.push(this.reader.getInteger(descendants[i], "npartsV"));
                            break;
                        case "patch":
                            let nPointsU = this.reader.getInteger(descendants[i], "npointsU");
                            let npointsV = this.reader.getInteger(descendants[i], "npointsV");
                            // descendantsAux.push(nPointsU);
                            // descendantsAux.push(npointsV);
                            descendantsAux.push(this.reader.getInteger(descendants[i], "npartsU"));
                            descendantsAux.push(this.reader.getInteger(descendants[i], "npartsV"))
                            let controlPointsU = [];
                            let controlPointsV = [];
                            for(let nChild = 0; nChild < descendants[i].children.length; nChild++ ){
                                let auxPoints = [];
                                let auxChild = descendants[i].children[nChild];
                                
                                auxPoints.push(this.reader.getFloat(auxChild, "x"));
                                auxPoints.push(this.reader.getFloat(auxChild, "y"));
                                auxPoints.push(this.reader.getFloat(auxChild, "z"));
                                auxPoints.push(1); //Weigth
                                controlPointsV.push(auxPoints);
                                if(controlPointsV.length == npointsV){
                                    controlPointsU.push(controlPointsV);
                                    controlPointsV = [];
                                }
                            }
                            if(controlPointsU.length != nPointsU){
                                this.onXMLMinorError("Wrong number of control points on leaf type patch on " + nodeID);
                            }
                            descendantsAux.push(controlPointsU);
                            break;
                        case "defbarrel":
                            descendantsAux.push(this.reader.getFloat(descendants[i], "base"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "middle"));
                            descendantsAux.push(this.reader.getFloat(descendants[i], "height"));
                            descendantsAux.push(this.reader.getInteger(descendants[i], "slices"));
                            descendantsAux.push(this.reader.getInteger(descendants[i], "stacks"));
                            break;
                    }
                }
                descendantsParsed.push(descendantsAux);
            }
            aux.push(descendantsParsed);

            var animationAux = [];
            if(animationIndex != -1){
                var animation;  
                animation = grandChildren[animationIndex];
                animationAux.push(this.reader.getString(animation,"id"));
            }
            aux.push(animationAux);

            this.nodes[nodeID] = aux;
        }
        this.log("Parsed Nodes");
    }

    parseBoolean(node, name, messageError) {
        let boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            boolVal = true
        }
        return boolVal;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        //To do: Create display loop for transversing the scene graph, calling the root node's display function

        //this.nodes[this.idRoot].display()
    }
}