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

    for (var i = 0; i < gameParameters.gears.length; i++)
    {
        var gearIntrinsics = gameParameters.gears[i];
        var pegPosition = gameParameters.pegPositions[i];    

        var meshId = addGearFromIntrinsics(scene, meshManager, gearIntrinsics, pegPosition);
    }    

    scene.registerBeforeRender(function () {
        // rotations
        for (var i = 0; i < gameParameters.gears.length; i++)
        {
            var mesh = meshManager.Meshes[i];
            mesh.rotation.y += 0.01;        
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