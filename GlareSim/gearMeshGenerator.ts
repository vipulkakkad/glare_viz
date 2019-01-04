module GlareSim {
    export class GearMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];
        FirstWindowVertex: number;
        LastWindowVertex: number;
        
        constructor(intrinsics: GearIntrinsics) {
            this.Vertices = [];
            this.Faces = [];

            var gearColor = new Color(0.2, 0.7, 1, 1);
            var windowColor = new Color(0.5, 0.3, 0.9, 1);

            // Window setup
            var windowCenterVID = 0;
            var windowFirstFID = 0;

            // center window vertices
            var windowLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                windowCenterVID,
                intrinsics.WindowRadius,
                0,
                6, 
                - (intrinsics.Height + 0.01),
                windowColor);

            // center window face
            var windowLastFID = MeshUtilities.addSunflowerFacesAndReturnLastFaceIndex(
                this.Faces,
                windowCenterVID,
                windowCenterVID + 1,
                windowLastVID,
                windowFirstFID,
                false);
            
            this.FirstWindowVertex = windowCenterVID;
            this.LastWindowVertex = windowLastVID;

            // Top setup
            var topCenterVID = windowLastVID + 1;
            var topFirstFID = windowLastFID + 1;
            
            // top edge vertices
            var topLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                topCenterVID, 
                intrinsics.Radius, 
                intrinsics.ToothAmplitude, 
                intrinsics.ToothCount, 
                -intrinsics.Height,
                gearColor);
            
            // top faces
            var topLastFID = MeshUtilities.addSunflowerFacesAndReturnLastFaceIndex(
                this.Faces,
                topCenterVID, 
                topCenterVID + 1, 
                topLastVID,
                topFirstFID,
                false);
          
            // Bottom setup
            var bottomCenterVID = topLastVID + 1;
            var bottomFirstFID = topLastFID + 1;

            // bottom edge vertices
            var bottomLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                bottomCenterVID, 
                intrinsics.Radius, 
                intrinsics.ToothAmplitude, 
                intrinsics.ToothCount, 
                0,
                gearColor);
            
            // bottom faces
            var bottomLastFID = MeshUtilities.addSunflowerFacesAndReturnLastFaceIndex(
                this.Faces,
                bottomCenterVID, 
                bottomCenterVID + 1, 
                bottomLastVID,
                bottomFirstFID,
                true);                

            // lateral faces
            var lastFaceIndex3 = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                this.Faces,
                topCenterVID + 1,
                bottomCenterVID + 1,
                topLastVID,
                bottomLastFID + 1,
                false);
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}