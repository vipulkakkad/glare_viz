function setBabylonMeshPosition(mesh, x, y) {
    mesh.position.x = x;
    mesh.position.y = y;
}

function setBabylonMeshRotation(mesh, theta) {
    mesh.rotation.z = theta;
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

function addBoard(scene, meshManager, gameParameters) {
    var gameBoard = new GlareSim.GameBoard(
        gameParameters.xMax,
        gameParameters.yMax,
        gameParameters.boardHeight,
        function (geometry) { return addBabylonMeshFromGeometry(scene, meshManager, geometry); },
        function (mesh, gamePeg) { mesh.metadata = gamePeg; });

    return gameBoard;
}

function addGearFromIntrinsics(scene, meshManager, gearIntrinsics, defaultPosition) {
    var gameGear = new GlareSim.GameGear(
        gearIntrinsics,
        defaultPosition,
        function (geometry) { return addBabylonMeshFromGeometry(scene, meshManager, geometry); },
        function (mesh, vertexId, color) { setBabylonMeshVertexColor(mesh, vertexId, color); },
        function (mesh, x, y) { setBabylonMeshPosition(mesh, x, y); },
        function (mesh, theta) { setBabylonMeshRotation(mesh, theta); },
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

function addLabelForHelp(scene, meshManager, x, y) {
    var meshId = meshManager.ClaimAndGetMeshId();

	var outputplane = BABYLON.Mesh.CreatePlane(meshId.toString(), 2, scene, false);
	outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
	outputplane.material = new BABYLON.StandardMaterial(meshId.toString(), scene);
    outputplane.position = new BABYLON.Vector3(x, y, -3);

    var outputplaneTexture = new BABYLON.DynamicTexture(meshId.toString(), 512, scene, true);
	outputplane.material.diffuseTexture = outputplaneTexture;
	outputplane.material.specularColor = new BABYLON.Color3(0, 0, 0);
	outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    outputplane.material.backFaceCulling = false;
    
    drawTextOnTexture(outputplaneTexture, "?", new GlareSim.Color(0.7, 0, 0, 1));

    return outputplane;
}

function drawTextOnTexture(texture, text, bgColor) {
    texture.drawText(text, null, 500, "bold 540px verdana", "black", bgColor.ToRgbHexString());
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

function showHelp() {
    alert(
        "Place and orient all the gears from the bottom row onto the pegs on the board. \n" +
        "> CLICK ON GEAR: selects gear\n" +
        "> CLICK ON BOARD: unselects gear\n" +
        "> SCROLL: scroll screen, or if gear selected, spin gear\n" +
        "> CLICK ON PEG: if gear selected, place selected gear here\n" +
        "> DOUBLE-CLICK ON GEAR: reset gear position off the board\n\n" +
        "You'll notice that as the gears spin on the pegs, the center changes color between white and black.\n\n" +
        "The rules are:\n" +
        "> Each peg must have a gear of the correct radius, so that no gears overlap (this will be obvious in the physical version :)\n" + 
        "> Gears must be oriented so that the center is either black or white\n" + 
        "> Gears must be oriented so that the centers of adjacent gears are opposite colors\n\n" + 
        "One gear has been placed for you, in a fixed orientation!\n")
}

function onScroll(game, isUpwards) {
    game.OnScroll(isUpwards);
}