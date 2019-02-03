/******* Config entries ******/
var showAdjacencyLines = true;
var colorScheme = "Default"; // options include "Chirality", "NotchEquivalence"
var solve = true;

/******* Create canvas and engine ******/
var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function (gameParameters) {    
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    // var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene);
    // camera.attachControl(canvas, true);
    var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(50, 37, -110), scene);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    //var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    var meshManager = new GlareSim.MeshManager();
    var yGearRow = -5;
    var xGearRow = -5;
    var defaultPegSpec = new GlareSim.PegSpec();

    var edges = GlareSim.Utilities.computeAdjacencies(
        gameParameters,
        function(x1, y1, x2, y2, meshName) {
            drawLine(x1, y1, x2, y2, meshName, scene, showAdjacencyLines)
        });

    GlareSim.Utilities.setChiralityInBipartiteManner(gameParameters, edges);
    GlareSim.Utilities.createGearIntrinsicsFromPegSpecs(gameParameters, edges);

    // Add meshes
    var meshManager = new GlareSim.MeshManager();

    // Add gears
    var yGearRow = -7;
    var xGearRow = 5;
    var defaultPegSpec = new GlareSim.PegSpec();

    var gameGears = [];
    for (var i = 0; i < gameParameters.pegs.length; i++) {
        defaultPegSpec.x = xGearRow;
        defaultPegSpec.y = yGearRow;
        defaultPegSpec.axisAngle = 0;

        var gearIntrinsics = gameParameters.gearIntrinsics[i];
        var gameGear = addGearFromIntrinsics(scene, meshManager, gearIntrinsics, defaultPegSpec, i);

        gameGears[i] = gameGear;

        var nextGearRadius = ((i + 1) < gameParameters.pegs.length) ?
            gameParameters.pegs[i + 1].expectedGearRadius : 0;
        xGearRow += gearIntrinsics.OuterRadius + nextGearRadius + 0.5;

        if ((xGearRow + nextGearRadius) > gameParameters.xMax) {
            xGearRow = 5;
            yGearRow -= 14;
        }
    }

    GlareSim.Utilities.colorGearsBy(colorScheme, gameParameters, gameGears);
    
    // Add pegs
    var gamePegs = [];
    var white = new GlareSim.Color(1, 1, 1, 1);
    for (var i = 0; i < gameParameters.pegs.length; i++)
    {
        var pegSpec = gameParameters.pegs[i];
        var gamePeg = addPegAtPosition(scene, meshManager, gameParameters, pegSpec);

        gamePegs[i] = gamePeg;
    }

    // Setup game
    var game = new GlareSim.Game(gamePegs, gameGears, gameParameters.startingPegIndex);

    // Add board
    var gameBoard = addBoard(scene, meshManager, gameParameters);

    var helpBoxMesh = addLabelForHelp(scene, meshManager, -1, gameParameters.yMax + 3);
//    alert("WELCOME TO GLARE!\n Click on the question-mark for flavor text");

    scene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
                if (pointerInfo.pickInfo.pickedMesh != null) {
                    if (pointerInfo.pickInfo.pickedMesh == helpBoxMesh) {
                        showHelp();
                    }
                    else {
                        onMeshClicked(pointerInfo.pickInfo.pickedMesh, game);-9
                    }
                } else {
                    game.OnOutsideClicked();
                }
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                if (pointerInfo.pickInfo.pickedMesh != null) {
                    onMeshDoubleClicked(pointerInfo.pickInfo.pickedMesh, game);
                }
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                if (game.WillHandleScroll()) {
                    onScroll(game, pointerInfo.event.wheelDelta < 0); // < 0 = upwards
                }
                else {
                    camera.position.y += (pointerInfo.event.wheelDelta/20);
                }
                break;
        }
    });

    if (solve) {
        game.Solve();
    }

    scene.registerBeforeRender(() => {})

    return scene;    
};

/******* End of the create scene function ******/
var fileIo = new GlareSim.FileIo();
fileIo.LoadParametersFromFileAsync("InputFiles/bleh0.json", () => {
    var scene = createScene(fileIo.GameParameters); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
});