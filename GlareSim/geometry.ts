module GlareSim {
    export class Geometry {
        public VerticesAsPositionTriplets: number[];
        public FacesAsVertexIndexTriplets: number[];
        public FaceColorsAsRgbaQuadruplets: number[];

        constructor(vertices: Vertex[], faces: Face[]){
            this.VerticesAsPositionTriplets = [];
            for (var i = 0; i < vertices.length; i++) {
                this.VerticesAsPositionTriplets[3*i + 0] = vertices[i].x;
                this.VerticesAsPositionTriplets[3*i + 1] = vertices[i].y;
                this.VerticesAsPositionTriplets[3*i + 2] = vertices[i].z;
            }

            this.FacesAsVertexIndexTriplets = [];
            this.FaceColorsAsRgbaQuadruplets = [];
            for (var i = 0; i < faces.length; i++) {
                this.FacesAsVertexIndexTriplets[3*i + 0] = faces[i].A;
                this.FacesAsVertexIndexTriplets[3*i + 1] = faces[i].B;
                this.FacesAsVertexIndexTriplets[3*i + 2] = faces[i].C;

                this.FaceColorsAsRgbaQuadruplets[12*i + 0] = faces[i].Color.R;
                this.FaceColorsAsRgbaQuadruplets[12*i + 1] = faces[i].Color.G;
                this.FaceColorsAsRgbaQuadruplets[12*i + 2] = faces[i].Color.B;
                this.FaceColorsAsRgbaQuadruplets[12*i + 3] = faces[i].Color.A;
                
                this.FaceColorsAsRgbaQuadruplets[12*i + 4] = faces[i].Color.R;
                this.FaceColorsAsRgbaQuadruplets[12*i + 5] = faces[i].Color.G;
                this.FaceColorsAsRgbaQuadruplets[12*i + 6] = faces[i].Color.B;
                this.FaceColorsAsRgbaQuadruplets[12*i + 7] = faces[i].Color.A;

                this.FaceColorsAsRgbaQuadruplets[12*i + 8] = faces[i].Color.R;
                this.FaceColorsAsRgbaQuadruplets[12*i + 9] = faces[i].Color.G;
                this.FaceColorsAsRgbaQuadruplets[12*i + 10] = faces[i].Color.B;
                this.FaceColorsAsRgbaQuadruplets[12*i + 11] = faces[i].Color.A;
            }
        }
    }
}