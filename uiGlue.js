function addGearFromIntrinsics(scene, meshManager, gearIntrinsics, pegPosition) {
    var gearMeshGen = new GlareSim.GearMeshGenerator(gearIntrinsics);
    var gearGeometry = gearMeshGen.GenerateGeometry();    
    
    var meshId = addMeshFromGeometry(scene, meshManager, gearGeometry);

    meshManager.Meshes[meshId].position.x = pegPosition.x;
    meshManager.Meshes[meshId].position.y = pegPosition.y;

    return meshId;
}

function addMeshFromGeometry(scene, meshManager, geometry) {
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

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(mesh);

    meshManager.SetMeshForMeshId(meshId, mesh);

    return meshId;
}