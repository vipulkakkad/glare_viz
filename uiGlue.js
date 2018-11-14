function addMeshWithIdAndGeometry(scene, meshManager, geometry) {
    // Reserve
    var meshId = meshManager.ClaimAndGetMeshId();

    // Add and manipulate meshes in the scene
    var mesh = new BABYLON.Mesh(meshId.toString(), scene);

    //Create a vertexData object lmb.
    var vertexData = new BABYLON.VertexData();

    //Assign positions and indices to vertexData
    vertexData.positions = geometry.VerticesAsPositionTriplets;
    vertexData.indices = geometry.FacesAsVertexIndexTriplets;

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(mesh);

    meshManager.SetMeshForMeshId(meshId, mesh);

    return meshId;
}