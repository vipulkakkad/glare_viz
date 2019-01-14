module GlareSim {
    export class BoardMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];

        constructor(parameters: GameParameters, showPegPositions: boolean) {          
            this.Vertices = [];
            this.Faces = [];
    
            var boardHeight = parameters.boardHeight;
            var pegRadius = parameters.pegRadius;
            var xMax = parameters.xMax;
            var yMax = parameters.yMax;
            var pegPositions = parameters.pegPositions;

            var boardColor = new Color(0.1, 0.1, 0.1, 1);
            var pegColor = new Color(0.7, 0.7, 0.7, 1);

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
            lastBoardFID += 2;

            MeshUtilities.addSquare(this.Faces, 4, 7, 5, 6, lastBoardFID + 1);
            lastBoardFID += 2;

            if (showPegPositions) {
                var nextPegCenterVID = 8;
                var nextPegFirstFID = lastBoardFID + 1;
    
                var thisPegLastVID;
                var thisPegLastFID;
                for (var i = 0; i < pegPositions.length; i++) {
                    // set IDs for 'this' iteration
                    var thisPegCenterVID = nextPegCenterVID;
                    var thisPegFirstFID = nextPegFirstFID;
    
                    // peg vertices for 'this' peg
                    thisPegLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                        this.Vertices,
                        thisPegCenterVID,
                        pegRadius,
                        0,
                        6, 
                        -0.01,
                        pegColor,
                        pegPositions[i].x,
                        pegPositions[i].y);
    
                    // peg faces for 'this' peg
                    thisPegLastFID = MeshUtilities.addSunflowerFacesAndReturnLastFaceIndex(
                        this.Faces,
                        thisPegCenterVID,
                        thisPegCenterVID + 1,
                        thisPegLastVID,
                        thisPegFirstFID);    
    
                    // populate indices for 'next' peg
                    nextPegCenterVID = thisPegLastVID + 1;
                    nextPegFirstFID = thisPegLastFID + 1;
                }
            }
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}
