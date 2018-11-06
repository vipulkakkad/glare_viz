var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    var customMesh = new BABYLON.Mesh("custom", scene);

    //Set arrays for positions and indices
    var radius = 1;
    var height = 0.8;
    var toothAmplitude = 0.2;
    var toothCount = 18;
    
    var gearMeshGen = new GlareSim.GearMeshGenerator(radius, toothAmplitude, toothCount, height);
    var gearGeometry = gearMeshGen.GenerateGeometry();    
    
    //Create a vertexData object lmb.
    var vertexData = new BABYLON.VertexData();

    //Assign positions and indices to vertexData
    vertexData.positions = gearGeometry.VerticesAsPositionTriplets;
    vertexData.indices = gearGeometry.FacesAsVertexIndexTriplets;

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(customMesh);

    scene.registerBeforeRender(function () {
        // rotations
        customMesh.rotation.y += 0.01;        
    });

    return scene;
};


/******* End of the create scene function ******/

var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});