module GlareSim {
    export class GearMeshGenerator {
        Vertices: Vertex[];
        Faces: Face[];

        constructor(intrinsics: GearIntrinsics) {
            this.Vertices = [];
            this.Faces = [];

            var centerVertexIndex1 = 0;
            var lastVertexIndex1 = this.addSunflowerVerticesAndReturnLastVertexIndex(centerVertexIndex1, intrinsics.Radius, intrinsics.ToothAmplitude, intrinsics.ToothCount, intrinsics.Height / 2);
            var lastFaceIndex1 = this.addSunflowerFacesAndReturnLastFaceIndex(centerVertexIndex1, centerVertexIndex1 + 1, lastVertexIndex1, 0);

            var centerVertexIndex2 = lastVertexIndex1 + 1;
            var lastVertexIndex2 = this.addSunflowerVerticesAndReturnLastVertexIndex(centerVertexIndex2, intrinsics.Radius, intrinsics.ToothAmplitude, intrinsics.ToothCount, -intrinsics.Height / 2);
            var lastFaceIndex2 = this.addSunflowerFacesAndReturnLastFaceIndex(centerVertexIndex2, centerVertexIndex2 + 1, lastVertexIndex2, lastFaceIndex1 + 1, true);

            var lastFaceIndex3 = this.addLateralFacesAndReturnLastFaceIndex(centerVertexIndex1 + 1, centerVertexIndex2 + 1, lastVertexIndex1, lastFaceIndex2 + 1);
        }

        public GenerateGeometry(): Geometry {
            return new Geometry(this.Vertices, this.Faces);
        }

        private addSunflowerVerticesAndReturnLastVertexIndex(
            startIndex: number,
            radius: number,
            toothAmplitude: number,
            toothCount: number,
            axialDeviation: number): number {

            var sideCount = toothCount * 2;
            var y = axialDeviation;

            this.Vertices[startIndex] = new Vertex(0, y, 0);

            var v = startIndex + 1;
            for (var i = 0; i < sideCount; i++) {
                var theta = (i / sideCount) * 2 * Math.PI;

                var radius_cur = radius + ((i % 2 === 0) ? toothAmplitude : -toothAmplitude);

                var x = radius_cur * Math.cos(theta);
                var z = radius_cur * Math.sin(theta);

                this.Vertices[v] = new Vertex(x, y, z);
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
            startFaceIndex: number): number {
            var endVertexIndex2 = startVertexIndex2 + (endVertexIndex1 - startVertexIndex1);
            this.addSquare(endVertexIndex1, endVertexIndex2, startVertexIndex1, startVertexIndex2, startFaceIndex);

            var v1 = startVertexIndex1;
            var v2 = startVertexIndex2;

            var f = startFaceIndex + 2;
            for (var i = startVertexIndex1; i < endVertexIndex1; i++) {
                this.addSquare(v1, v2, v1 + 1, v2 + 1, f);
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
            startFaceIndex: number) {
            this.Faces[startFaceIndex + 0] = new Face(a1, a2, b1);
            this.Faces[startFaceIndex + 1] = new Face(b1, a2, b2);
        }
    }
}