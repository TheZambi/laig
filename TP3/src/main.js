//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', './src/XMLscene.js', './src/MySceneGraph.js', './src/MyInterface.js',
 './src/MyRectangle.js','./src/MyCylinder.js','./src/MySphere.js','./src/MyTriangle.js','./src/MyNode.js','./src/MyTorus.js',
 './src/Animation.js','./src/AnimationKeyFrame.js','./src/KeyFrameAnimation.js',
 './src/MySpriteSheet.js','./src/MySpriteText.js','./src/MySpriteAnimation.js',
 './src/Plane.js', './src/Patch.js','./src/Barrel.js','./src/MyGameBoard.js','./src/MyGameMove.js',
 './src/MyGameSequence.js','./src/MyPiece.js','./src/MyTile.js','./src/MyGameOrchestrator.js',
 './src/MyPrologInterface.js','./src/PieceBox.js', './src/MyAnimator.js','./src/MyColorIndicator.js','./src/MyOpenBox.js',
 './src/MyGameScore.js','./src/MyTurnTimer.js',


main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);
    var firstScene = 1;
    var otherScene = 0;

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var file1=getUrlVars()['file'] || "Farm.xml";
    var file2= "Room.xml";

	// create and load graph, and associate it to scene. 
	// Check console for loading errors
    var myGraph = new MySceneGraph(file1, myScene, otherScene);
    var nextGraph = new MySceneGraph(file2, myScene, firstScene);
	
	// start
    app.run();
}

]);