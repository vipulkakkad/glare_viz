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

function addGearFromIntrinsics(scene, meshManager, gearIntrinsics) {
    var gameGear = new GlareSim.GameGear(
        gearIntrinsics,
        function (geometry) { return addBabylonMeshFromGeometry(scene, meshManager, geometry); },
        function (mesh, vertexId, color) { setBabylonMeshVertexColor(mesh, vertexId, color); },
        function (mesh, x, y) { setBabylonMeshPosition(mesh, x, y); },
        function (mesh, gameGear) { mesh.metadata = gameGear; });
    
    return gameGear;
}