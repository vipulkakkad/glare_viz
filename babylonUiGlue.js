function setBabylonMeshPosition(mesh, x, y) {
    mesh.position.x = x;
    mesh.position.y = y;
}

function setBabylonMeshVertexColor(mesh, vertexId, color) {

    var meshColors = mesh.getVerticesData(BABYLON.VertexBuffer.ColorKind);

    meshColors[4*vertexId + 0] = color.R;
    meshColors[4*vertexId + 1] = color.G;
    meshColors[4*vertexId + 2] = color.B;
    meshColors[4*vertexId + 3] = color.A;

    mesh.updateVerticesData(BABYLON.VertexBuffer.ColorKind, meshColors);
}

function addBabylonMeshFromGeometry(scene, meshManager, geometry) {
    // Reserve
    var meshId = meshManager.ClaimAndGetMeshId();

    // Add and manipulate meshes in the scene
    var mesh = new BABYLON.Mesh(meshId.toString(), scene);

    var positions = geometry.VerticesAsPositionTriplets;
    var indices = geometry.FacesAsVertexIndexTriplets;
    var colors = geometry.VertexColorsAsRgbaQuadruplets;
    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);

    //Create a vertexData object lmb.
    var vertexData = new BABYLON.VertexData();

    //Assign positions and indices to vertexData
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.colors = colors;
    // vertexData.normals = normals;

    //Apply vertexData to custom mesh, true = is updatable
    vertexData.applyToMesh(mesh, true);

    meshManager.SetMeshForMeshId(meshId, mesh);

    return mesh;
}

function addGearFromSpec(scene, meshManager, gameParameters, gearSpec, defaultPosition) {
    var gearIntrinsics = new GlareSim.GearIntrinsics(gearSpec, gameParameters.gearHeight, gameParameters.pegRadius);
    var gameGear = new GlareSim.GameGear(
        gearIntrinsics,
        defaultPosition,
        function (geometry) { return addBabylonMeshFromGeometry(scene, meshManager, geometry); },
        function (mesh, vertexId, color) { setBabylonMeshVertexColor(mesh, vertexId, color); },
        function (mesh, x, y) { setBabylonMeshPosition(mesh, x, y); },
        function (mesh, gameGear) { mesh.metadata = gameGear; });
    
    return gameGear;
}

function addPegAtPosition(scene, meshManager, gameParameters, pegPosition) {
    var gamePeg = new GlareSim.GamePeg(
        gameParameters.pegRadius,
        gameParameters.boardHeight / 2,
        pegPosition,
        function (geometry) { return addBabylonMeshFromGeometry(scene, meshManager, geometry); },
        function (mesh, vertexId, color) { setBabylonMeshVertexColor(mesh, vertexId, color); },
        function (mesh, x, y) { setBabylonMeshPosition(mesh, x, y); },
        function (mesh, gamePeg) { mesh.metadata = gamePeg; });

    return gamePeg;
}

function addBoard(scene, meshManager, gameParameters) {
    var gameBoard = new GlareSim.GameBoard(
        gameParameters.xMax,
        gameParameters.yMax,
        gameParameters.boardHeight,
        function (geometry) { return addBabylonMeshFromGeometry(scene, meshManager, geometry); },
        function (mesh, gamePeg) { mesh.metadata = gamePeg; });

    return gameBoard;
}

function onMeshClicked(mesh, game) {
    var gameObject = mesh.metadata;

    if (gameObject != null) {
        switch(gameObject.Type)
        {
            case "GameGear":
                game.OnGearClicked(gameObject);
                break;
            case "GamePeg":
                game.OnPegClicked(gameObject);
                break;
            case "GameBoard":
                game.OnBoardClicked();
                break;
            default:
                console.log("WAT... what type of mesh got clicked? Mesh ID: " + mesh.id);
                break;
        }    
    }
    else {
        console.log("Mesh clicked: " + mesh.id);
    }
}

function onMeshDoubleClicked(mesh, game) {
    var gameObject = mesh.metadata;

    if (gameObject != null) {
        switch(gameObject.Type)
        {
            case "GameGear":
                game.OnGearDoubleClicked(gameObject);
                break;
            default:
                console.log("Double click does nothing on non-gear meshes.");
                break;
        }    
    }
    else {
        console.log("Mesh clicked: " + mesh.id);
    }
}