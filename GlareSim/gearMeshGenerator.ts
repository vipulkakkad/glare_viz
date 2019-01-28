module GlareSim {
    export class GearMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];
        FirstWindowVertex: number;
        LastWindowVertex: number;
        FirstGearVertex: number;
        LastGearVertex: number;
        
        constructor(intrinsics: GearIntrinsics, createWindow: boolean, gearColor: Color) {
            this.Vertices = [];
            this.Faces = [];

            var windowColor = new Color(0.5, 0.5, 0.5, 1);

            var windowLastVID = -1;
            var windowLastFID = -1;    

            if (createWindow){
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
            }

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
            var lateralLastFID = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                this.Faces,
                topCenterVID + 1,
                bottomCenterVID + 1,
                topLastVID,
                bottomLastFID + 1,
                false);

            this.FirstGearVertex = topCenterVID;
            this.LastGearVertex = bottomLastVID;

            for (var i = 0; i < intrinsics.NotchAngles.length; i++) {
                MeshUtilities.addNotchAfterOtherVerticesAndFaces(
                    this.Vertices,
                    this.Faces,
                    intrinsics.Radius,
                    intrinsics.ToothAmplitude,
                    - (intrinsics.Height + 0.01),
                    new Color(0,0,0,1),
                    intrinsics.NotchAngles[i]);
            }
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}