module GlareSim {
    export class BoardMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];

        constructor(
            xMax: number,
            yMax: number,
            pegPositions: GamePegPosition[]) {

            this.Vertices = [];
            this.Faces = [];
    
            var boardHeight = 0.2;
            var boardColor = new Color(0.1, 0.1, 0.1, 1);
            var pegColor = new Color(0.3, 0.3, 0.3, 1);

            this.Vertices[0] = new Vertex(   0,    0, 0, boardColor);
            this.Vertices[1] = new Vertex(xMax,    0, 0, boardColor);
            this.Vertices[2] = new Vertex(xMax, yMax, 0, boardColor);
            this.Vertices[3] = new Vertex(   0, yMax, 0, boardColor);

            this.Vertices[4] = new Vertex(   0,    0, boardHeight, boardColor);
            this.Vertices[5] = new Vertex(xMax,    0, boardHeight, boardColor);
            this.Vertices[6] = new Vertex(xMax, yMax, boardHeight, boardColor);
            this.Vertices[7] = new Vertex(   0, yMax, boardHeight, boardColor);

            var firstBoardFID = 0;
            var lastBoardFID = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                this.Faces,
                0,
                4,
                3,
                firstBoardFID);
            
            MeshUtilities.addSquare(this.Faces, 0, 1, 3, 2, lastBoardFID + 1);
            MeshUtilities.addSquare(this.Faces, 4, 7, 5, 6, lastBoardFID + 3);
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}
