module GlareSim {
    export class Geometry {
        public VerticesAsPositionTriplets: number[];
        public FacesAsVertexIndexTriplets: number[];

        constructor(vertices: Vertex[], faces: Face[]){
            this.VerticesAsPositionTriplets = [];
            for (var i = 0; i < vertices.length; i++) {
                this.VerticesAsPositionTriplets[3*i + 0] = vertices[i].x;
                this.VerticesAsPositionTriplets[3*i + 1] = vertices[i].y;
                this.VerticesAsPositionTriplets[3*i + 2] = vertices[i].z;
            }

            this.FacesAsVertexIndexTriplets = [];
            for (var i = 0; i < faces.length; i++) {
                this.FacesAsVertexIndexTriplets[3*i + 0] = faces[i].A;
                this.FacesAsVertexIndexTriplets[3*i + 1] = faces[i].B;
                this.FacesAsVertexIndexTriplets[3*i + 2] = faces[i].C;
            }
        }
    }
}