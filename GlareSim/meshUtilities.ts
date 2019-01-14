module GlareSim {
    export class MeshUtilities {
        public static addSunflowerVerticesAndReturnLastVertexIndex(
            vertices: Vertex[],
            startIndex: number,
            radius: number,
            toothAmplitude: number,
            toothCount: number,
            axialDeviation: number,
            color: Color,
            xDeviation: number = 0,
            yDeviation: number = 0): number {

            var sideCount = toothCount * 2;
            var z = axialDeviation;

            vertices[startIndex] = new Vertex(xDeviation, yDeviation, z, color.Perturb(0.1));

            var v = startIndex + 1;
            for (var i = 0; i < sideCount; i++) {
                var theta = (i / sideCount) * 2 * Math.PI;

                var radius_cur = radius + ((i % 2 === 0) ? toothAmplitude : -toothAmplitude);

                var x = xDeviation + radius_cur * Math.cos(theta);
                var y = yDeviation + radius_cur * Math.sin(theta);

                vertices[v] = new Vertex(x, y, z, color.Perturb(0.3));
                v++;
            }

            return v - 1;
        }

        public static addSunflowerFacesAndReturnLastFaceIndex(
            faces: Face[],
            centerVertexIndex: number,
            firstEdgeVertexIndex: number,
            lastEdgeVertexIndex: number,
            startFaceIndex: number,
            invert: boolean = false): number {
            faces[startFaceIndex] = invert ?
                new Face(firstEdgeVertexIndex, lastEdgeVertexIndex, centerVertexIndex) :
                new Face(lastEdgeVertexIndex, firstEdgeVertexIndex, centerVertexIndex);

            var f = startFaceIndex + 1;
            for (var i = firstEdgeVertexIndex; i < lastEdgeVertexIndex; i++) {
                faces[f] = invert ?
                    new Face(i + 1, i, centerVertexIndex) :
                    new Face(i, i + 1, centerVertexIndex);

                f++;
            }

            return f - 1;
        }

        public static addLateralFacesAndReturnLastFaceIndex(
            faces: Face[],
            startVertexIndex1: number,
            startVertexIndex2: number,
            endVertexIndex1: number,
            startFaceIndex: number,
            invert: boolean = false)
            : number {
            var endVertexIndex2 = startVertexIndex2 + (endVertexIndex1 - startVertexIndex1);
            this.addSquare(faces, endVertexIndex1, endVertexIndex2, startVertexIndex1, startVertexIndex2, startFaceIndex);

            var v1 = startVertexIndex1;
            var v2 = startVertexIndex2;

            var f = startFaceIndex + 2;
            for (var i = startVertexIndex1; i < endVertexIndex1; i++) {
                this.addSquare(faces, v1, v2, v1 + 1, v2 + 1, f, invert);
                v1++;
                v2++;
                f += 2;
            }

            return f - 1;
        }

        public static addSquare(
            faces: Face[],
            a1: number,
            a2: number,
            b1: number,
            b2: number,
            startFaceIndex: number,
            invert: boolean = false) {
            faces[startFaceIndex + 0] = invert ? new Face(a2, a1, b1) : new Face(a1, a2, b1);
            faces[startFaceIndex + 1] = invert ? new Face(a2, b1, b2) : new Face(b1, a2, b2);
        }
    }
}