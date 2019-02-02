module GlareSim {
    export class HollowGearMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];
        FirstGearVertex: number;
        LastGearVertex: number;
        
        constructor(intrinsics: HollowGearIntrinsics, gearColor: Color) {
            this.Vertices = [];
            this.Faces = [];

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
                gearColor);
            
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
                gearColor);
            
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
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }
    }
}