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
            var circleLastVID = this.addSunflowerVerticesAndReturnLastVertexIndex(
                circleCenterVID,
                (intrinsics.Radius - intrinsics.ToothAmplitude) * 0.8,
                0,
                6, 
                (intrinsics.Height / 2) + 0.01,
                circleColor);

            // center circle face
            var circleLastFID = this.addSunflowerFacesAndReturnLastFaceIndex(
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
            var topLastVID = this.addSunflowerVerticesAndReturnLastVertexIndex(
                topCenterVID, 
                intrinsics.Radius, 
                intrinsics.ToothAmplitude, 
                intrinsics.ToothCount, 
                intrinsics.Height / 2,
                gearColor);
            
            // top faces
            var topLastFID = this.addSunflowerFacesAndReturnLastFaceIndex(
                topCenterVID, 
                topCenterVID + 1, 
                topLastVID,
                topFirstFID);
          
            // Bottom setup
            var bottomCenterVID = topLastVID + 1;
            var bottomFirstFID = topLastFID + 1;

            // bottom edge vertices
            var bottomLastVID = this.addSunflowerVerticesAndReturnLastVertexIndex(
                bottomCenterVID, 
                intrinsics.Radius, 
                intrinsics.ToothAmplitude, 
                intrinsics.ToothCount, 
                -intrinsics.Height / 2,
                gearColor);
            
            // bottom faces
            var bottomLastFID = this.addSunflowerFacesAndReturnLastFaceIndex(
                bottomCenterVID, 
                bottomCenterVID + 1, 
                bottomLastVID,
                bottomFirstFID,
                true);                

            // lateral faces
            var lastFaceIndex3 = this.addLateralFacesAndReturnLastFaceIndex(
                topCenterVID + 1,
                bottomCenterVID + 1,
                topLastVID,
                bottomLastFID + 1,
                gearColor);            
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }

        private addSunflowerVerticesAndReturnLastVertexIndex(
            startIndex: number,
            radius: number,
            toothAmplitude: number,
            toothCount: number,
            axialDeviation: number,
            color: Color): number {

            var sideCount = toothCount * 2;
            var y = axialDeviation;

            this.Vertices[startIndex] = new Vertex(0, y, 0, color);

            var v = startIndex + 1;
            for (var i = 0; i < sideCount; i++) {
                var theta = (i / sideCount) * 2 * Math.PI;

                var radius_cur = radius + ((i % 2 === 0) ? toothAmplitude : -toothAmplitude);

                var x = radius_cur * Math.cos(theta);
                var z = radius_cur * Math.sin(theta);

                this.Vertices[v] = new Vertex(x, y, z, color);
                v++;
            }

            return v - 1;
        }

        private addSunflowerFacesAndReturnLastFaceIndex(
            centerVertexIndex: number,
            firstEdgeVertexIndex: number,
            lastEdgeVertexIndex: number,
            startFaceIndex: number,
            invert: boolean = false): number {
            this.Faces[startFaceIndex] = invert ?
                new Face(firstEdgeVertexIndex, lastEdgeVertexIndex, centerVertexIndex) :
                new Face(lastEdgeVertexIndex, firstEdgeVertexIndex, centerVertexIndex);

            var f = startFaceIndex + 1;
            for (var i = firstEdgeVertexIndex; i < lastEdgeVertexIndex; i++) {
                this.Faces[f] = invert ?
                    new Face(i + 1, i, centerVertexIndex) :
                    new Face(i, i + 1, centerVertexIndex);

                f++;
            }

            return f - 1;
        }

        private addLateralFacesAndReturnLastFaceIndex(
            startVertexIndex1: number,
            startVertexIndex2: number,
            endVertexIndex1: number,
            startFaceIndex: number,
            color: Color): number {
            var endVertexIndex2 = startVertexIndex2 + (endVertexIndex1 - startVertexIndex1);
            this.addSquare(endVertexIndex1, endVertexIndex2, startVertexIndex1, startVertexIndex2, color, startFaceIndex);

            var v1 = startVertexIndex1;
            var v2 = startVertexIndex2;

            var f = startFaceIndex + 2;
            for (var i = startVertexIndex1; i < endVertexIndex1; i++) {
                this.addSquare(v1, v2, v1 + 1, v2 + 1, color, f);
                v1++;
                v2++;
                f += 2;
            }

            return f - 1;
        }

        private addSquare(
            a1: number,
            a2: number,
            b1: number,
            b2: number,
            color: Color,
            startFaceIndex: number) {
            this.Faces[startFaceIndex + 0] = new Face(a1, a2, b1);
            this.Faces[startFaceIndex + 1] = new Face(b1, a2, b2);
        }
    }
}