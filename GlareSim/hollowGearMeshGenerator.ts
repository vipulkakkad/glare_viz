module GlareSim {
    export class HollowGearMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];
        FirstGearVertex: number;
        LastGearVertex: number;
        
        constructor(intrinsics: HollowGearIntrinsics, gearColor: Color) {
            this.Vertices = [];
            this.Faces = [];

            var xInnerDeviation = intrinsics.HoleDeviation * Math.cos(intrinsics.HoleAngle);
            var yInnerDeviation = intrinsics.HoleDeviation * Math.sin(intrinsics.HoleAngle);

            // Top setup
            var topInnerFirstVID = 0;
            var topFirstFID = 0;
            
            // top inner edge vertices
            var topInnerLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                topInnerFirstVID, 
                intrinsics.InnerRadius, 
                intrinsics.InnerToothAmplitude, 
                intrinsics.ToothCount, 
                -intrinsics.Height,
                gearColor,
                xInnerDeviation,
                yInnerDeviation);
            
            // top outer edge vertices
            var topOuterFirstVID = topInnerLastVID + 1;
            var topOuterLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                topOuterFirstVID, 
                intrinsics.OuterRadius, 
                intrinsics.OuterToothAmplitude, 
                intrinsics.ToothCount, 
                -intrinsics.Height,
                gearColor);

            // top faces
            var topLastFID = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                    this.Faces,
                    topInnerFirstVID,
                    topOuterFirstVID,
                    topInnerLastVID,
                    topFirstFID,
                    false);              

            // Bottom setup
            var bottomInnerFirstVID = topOuterLastVID + 1;
            var bottomFirstFID = topLastFID + 1;
            
            // bottom inner edge vertices
            var bottomInnerLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                bottomInnerFirstVID, 
                intrinsics.InnerRadius, 
                intrinsics.InnerToothAmplitude, 
                intrinsics.ToothCount, 
                intrinsics.Height,
                gearColor,
                xInnerDeviation,
                yInnerDeviation);
            
            // bottom outer edge vertices
            var bottomOuterFirstVID = bottomInnerLastVID + 1;
            var bottomOuterLastVID = MeshUtilities.addSunflowerVerticesAndReturnLastVertexIndex(
                this.Vertices,
                bottomOuterFirstVID, 
                intrinsics.OuterRadius, 
                intrinsics.OuterToothAmplitude, 
                intrinsics.ToothCount, 
                intrinsics.Height,
                gearColor);
                
            // bottom faces
            var bottomLastFID = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                    this.Faces,
                    bottomInnerFirstVID,
                    bottomOuterFirstVID,
                    bottomInnerLastVID,
                    bottomFirstFID,
                    true);

            // inner faces
            var innerFirstFID = bottomLastFID + 1;
            var innerLastFID = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                this.Faces,
                bottomInnerFirstVID,
                topInnerFirstVID,
                bottomInnerLastVID,
                innerFirstFID,
                false);

            // outer faces
            var outerFirstFID = innerLastFID + 1;
            var outerLastFID = MeshUtilities.addLateralFacesAndReturnLastFaceIndex(
                this.Faces,
                topOuterFirstVID,
                bottomOuterFirstVID,
                topOuterLastVID,
                outerFirstFID,
                false);

            this.FirstGearVertex = topInnerFirstVID;
            this.LastGearVertex = bottomOuterLastVID;

            for (var i = 0; i < intrinsics.NotchAngles.length; i++) {
                MeshUtilities.addNotchAfterOtherVerticesAndFaces(
                    this.Vertices,
                    this.Faces,
                    intrinsics.OuterRadius,
                    intrinsics.OuterToothAmplitude,
                    - (intrinsics.Height + 0.01),
                    new Color(1,0,0,1),
                    intrinsics.NotchAngles[i]);
            }
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}