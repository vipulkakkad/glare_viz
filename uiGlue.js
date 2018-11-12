function addMeshWithIdAndGeometry(scene, meshId, geometry) {
    var mesh = new BABYLON.Mesh(meshId.toString(), scene);

    //Create a vertexData object lmb.
    var vertexData = new BABYLON.VertexData();

    //Assign positions and indices to vertexData
    vertexData.positions = gearGeometry.VerticesAsPositionTriplets;
    vertexData.indices = gearGeometry.FacesAsVertexIndexTriplets;

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(mesh);
}