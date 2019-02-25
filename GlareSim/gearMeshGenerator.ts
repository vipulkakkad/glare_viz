module GlareSim {
    export class GearMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];
        FirstGearVertex: number;
        LastGearVertex: number;
        
        constructor(intrinsics: GearIntrinsics, gearColor: Color) {
            this.Vertices = [];
            this.Faces = [];

            // Top setup
            var topCenterVID = 0;
            var topFirstFID = 0;
            
            // top edge vertices
            var topLastVID = MeshUtilities.addCenterAndSunflowerVerticesAndReturnLastVertexIndex(
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
            var bottomLastVID = MeshUtilities.addCenterAndSunflowerVerticesAndReturnLastVertexIndex(
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
            var lateralLastFID = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                this.Faces,
                topCenterVID + 1,
                bottomCenterVID + 1,
                topLastVID,
                bottomLastFID + 1,
                false);

            this.FirstGearVertex = topCenterVID;
            this.LastGearVertex = bottomLastVID;
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}