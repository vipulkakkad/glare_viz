var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function (gameParameters) {    
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    var meshManager = new GlareSim.MeshManager();
    var yGearRow = -5;
    var xGearRow = -5;

    for (var i = 0; i < gameParameters.gears.length; i++)
    {
        var gearSpec = gameParameters.gears[i];
        var gearIntrinsics = new GlareSim.GearIntrinsics(gearSpec, gameParameters.gearHeight, gameParameters.pegRadius);
        var gameGear = addGearFromIntrinsics(scene, meshManager, gearIntrinsics);

        gameGear.SetPosition(xGearRow, yGearRow);
        xGearRow += (2 * gearSpec.Radius) + 0.5;
    }    

    var boardMeshGen = new GlareSim.BoardMeshGenerator(gameParameters);
    var boardGeometry = boardMeshGen.GenerateGeometry();

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