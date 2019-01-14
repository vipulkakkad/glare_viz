var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

function getMeshFromPick(pointerInfo) {
    if (pointerInfo.pickInfo.pickedMesh != null) {
        return (" ON " + pointerInfo.pickInfo.pickedMesh.id);
    } else {
        return "";
    }
}

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
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    var meshManager = new GlareSim.MeshManager();
    var yGearRow = -5;
    var xGearRow = -5;

    for (var i = 0; i < gameParameters.gears.length; i++)
    {
        var gearSpec = gameParameters.gears[i];        
        var gameGear = addGearFromSpec(scene, meshManager, gameParameters, gearSpec);

        gameGear.SetPosition(xGearRow, yGearRow);
        xGearRow += (2 * gearSpec.Radius) + 0.5;
    }    

    var boardMeshGen = new GlareSim.BoardMeshGenerator(gameParameters, false); // false => don't show peg positions
    var boardGeometry = boardMeshGen.GenerateGeometry();

    for (var i = 0; i < gameParameters.pegPositions.length; i++)
    {
        var pegPosition = gameParameters.pegPositions[i];
        var gamePeg = addPegAtPosition(scene, meshManager, gameParameters, pegPosition);
    }        

    addBabylonMeshFromGeometry(scene, meshManager, boardGeometry);

    scene.registerBeforeRender(function () {
        // rotations
        for (var i = 0; i < gameParameters.gears.length; i++)
        {
            var mesh = meshManager.Meshes[i];
            mesh.rotation.z += 0.01;

            var s = 1 + (0.5 * Math.sin(mesh.rotation.z));
            gameGear.SetWindowColor(new GlareSim.Color(s, s, s, 1));
        }            
    });

    scene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log("POINTER DOWN" + getMeshFromPick(pointerInfo));                
                if (pointerInfo.pickInfo.pickedMesh != null) {
                    var gameGear = pointerInfo.pickInfo.pickedMesh.metadata;
                    gameGear.SetWindowColor(new GlareSim.Color(0, 1, 0, 1));
                }
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
				console.log("POINTER UP" + getMeshFromPick(pointerInfo));
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:
                console.log("POINTER MOVE" + getMeshFromPick(pointerInfo));
				break;
			case BABYLON.PointerEventTypes.POINTERWHEEL:
				console.log("POINTER WHEEL" + getMeshFromPick(pointerInfo));
				break;
			case BABYLON.PointerEventTypes.POINTERPICK:
				console.log("POINTER PICK" + getMeshFromPick(pointerInfo));
				break;
			case BABYLON.PointerEventTypes.POINTERTAP:
				console.log("POINTER TAP" + getMeshFromPick(pointerInfo));
				break;
			case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
				console.log("POINTER DOUBLE-TAP" + getMeshFromPick(pointerInfo));
				break;
        }
    });

    return scene;    
};

/******* End of the create scene function ******/
var fileIo = new GlareSim.FileIo();
fileIo.LoadParametersFromFileAsync("InputFiles/twoGears.json", () => {
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