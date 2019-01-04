module GlareSim {
    export class GearMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];
        FirstCircleVertex: number;
        LastCircleVertex: number;
        
        constructor(intrinsics: GearIntrinsics) {
            this.Vertices = [];
            this.Faces = [];

            var gearColor = new Color(0, 1, 1, 1);
            var circleColor = new Color(1, 0, 0, 1);

            // Circle setup
            var circleCenterVID = 0;
            var circleFirstFID = 0;

            // center circle vertices
            var circleLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                circleCenterVID,
                (intrinsics.Radius - intrinsics.ToothAmplitude) * 0.8,
                0,
                6, 
                (intrinsics.Height / 2) + 0.01,
                circleColor);

            // center circle face
            var circleLastFID = MeshUtilities.addSunflowerFacesAndReturnLastFaceIndex(
                this.Faces,
                circleCenterVID,
                circleCenterVID + 1,
                circleLastVID,
                circleFirstFID);
            
            this.FirstCircleVertex = circleCenterVID;
            this.LastCircleVertex = circleLastVID;

            // Top setup
            var topCenterVID = circleLastVID + 1;
            var topFirstFID = circleLastFID + 1;
            
            // top edge vertices
            var topLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                topCenterVID, 
                intrinsics.Radius, 
                intrinsics.ToothAmplitude, 
                intrinsics.ToothCount, 
                intrinsics.Height / 2,
                gearColor);
            
            // top faces
            var topLastFID = MeshUtilities.addSunflowerFacesAndReturnLastFaceIndex(
                this.Faces,
                topCenterVID, 
                topCenterVID + 1, 
                topLastVID,
                topFirstFID);
          
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
                -intrinsics.Height / 2,
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
                bottomLastFID + 1);            
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}