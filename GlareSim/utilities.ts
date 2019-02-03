module GlareSim {
    export type UiMeshXYLineDrawer = (x1: number, y1: number, x2: number, y2: number, meshName: string) => void;

    export class Utilities {
        public static computeAdjacencies(gameParams: GameParameters, drawLine: UiMeshXYLineDrawer) : number[][] {
            var threshold = 0.1;

            var pegs = gameParams.pegs;
            var n = gameParams.pegs.length;

            var edges = [];
            for (var j = 0; j < n; j++) {
                edges[j] = [];
            }

            for (var i = 0; i < n; i++) {
                for (var j = 0; j < i; j++) {
                    if (i != j) {

                        var xdiff = (pegs[i].x - pegs[j].x);
                        var ydiff = (pegs[i].y - pegs[j].y);
                        var distance = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
                        var radiiSum = (pegs[i].expectedGearRadius + pegs[j].expectedGearRadius);
    
                        var delta = Math.abs(distance - radiiSum);

                        if (delta < threshold) {
                            drawLine(pegs[i].x, pegs[i].y, pegs[j].x, pegs[j].y, i + "-" + j);

                            edges[j].push(i);
                            edges[i].push(j);
                        }
                    }
                }
            }

            return edges;
        }    

        public static setStartsClearInBipartiteManner(
            gameParams: GameParameters,
            edges: number[][]) {

            var n = gameParams.pegs.length;

            var partition = [];
            for (var j = 0; j < n; j++) {
                partition[j] = null;
            }

            partition[0] = true;
            var assigned = 1;

            while (assigned < n) {
                for (var source = 0; source < n; source++) {
                    if (partition[source] != null) {
                        var sourceEdges = edges[source];
                        for (var edge = 0; edge < sourceEdges.length; edge++) {
                            var target = sourceEdges[edge];
                            if (partition[target] == null) {
                                assigned++;
                                partition[target] = !partition[source];
                                //console.log(target + " -> " + partition[target]);
                            }
                        }    
                    }
                }
            }

            for (var j = 0; j < n; j++) {
                gameParams.pegs[j].isPositiveChirality = partition[j];
            }
        }

        public static createGearIntrinsicsFromPegSpecs(
            gameParams: GameParameters,
            edges: number[][]) {

            var n = gameParams.pegs.length;
            gameParams.gearIntrinsics = [];
            
            for (var j = 0; j < n; j++) {
                var notchAngles = Utilities.getNotchAngles(gameParams.pegs, j, edges[j]); 
                var sortedNotchAngles = notchAngles.sort((n1,n2) => n1 - n2);

                var gaps = this.getGapsInOrder(sortedNotchAngles);

                var holeRadius = 0.75;

                gameParams.gearIntrinsics[j] = new GlareSim.HollowGearIntrinsics(
                    holeRadius,
                    0,
                    gameParams.pegs[j].expectedGearRadius,
                    gameParams.toothAmplitude,
                    6 * gameParams.pegs[j].expectedGearRadius,
                    gameParams.gearHeight,
                    0,
                    2 * holeRadius + 0.2,
                    sortedNotchAngles);
            }

            this.setNotchEquivalenceClasses(gameParams.gearIntrinsics);
        }

        private static getNotchAngles(pegs: PegSpec[], currentIndex: number, adjacentIndices: number[]) {
            var angles = [];
            var currentPoint = pegs[currentIndex];

            for (var i = 0; i < adjacentIndices.length; i++) {
                var adjacentPoint = pegs[adjacentIndices[i]];
                angles[i] = this.normalizeAngleFromZeroToTwoPi(Math.atan2(adjacentPoint.y - currentPoint.y, adjacentPoint.x - currentPoint.x));
            }

            return angles;
        }

        private static setNotchEquivalenceClasses(gearIntrinsics: HollowGearIntrinsics[]) {
            var tolerance = 0.25;

            var gapsInOrder = [];
            for (var i = 0; i < gearIntrinsics.length; i++) {
                gapsInOrder[i] = this.getGapsInOrder(gearIntrinsics[i].NotchAngles);
            }

            var currentEquivalenceClass = 0;
            gearIntrinsics[0].NotchEquivalenceClass = currentEquivalenceClass;
            for (var i = 1; i < gearIntrinsics.length; i++) {
                var j = 0;
                while(gearIntrinsics[i].NotchEquivalenceClass < 0 && j < i) {
                    if (this.AreInSameNotchEquivalenceClass(
                        gearIntrinsics[i].OuterRadius,
                        gearIntrinsics[j].OuterRadius,
                        gapsInOrder[i],
                        gapsInOrder[j],
                        tolerance)) {
                        gearIntrinsics[i].NotchEquivalenceClass = gearIntrinsics[j].NotchEquivalenceClass;
                    }

                    j++;
                }

                if (gearIntrinsics[i].NotchEquivalenceClass < 0) {
                    currentEquivalenceClass++;
                    gearIntrinsics[i].NotchEquivalenceClass = currentEquivalenceClass;
                }

                var logObj = {
                    eqclass: gearIntrinsics[i].NotchEquivalenceClass,
                    gaps: JSON.stringify(gapsInOrder[i]),
                    angles: gearIntrinsics[i].NotchAngles
                };
                console.log(logObj);
            }
        }

        private static AreInSameNotchEquivalenceClass(
            radius1: number,
            radius2: number,
            orderedGaps1: number[],
            orderedGaps2: number[],
            tolerance: number) : boolean {

            // if (radius1 != radius2) {
            //     return false;
            // }

            if (orderedGaps1.length != orderedGaps2.length) {
                return false;
            }

            var n = orderedGaps1.length;
            var matchedGaps = -1;
            for (var offset = 0; offset < n; offset++) {
                matchedGaps = 0;
                for (var j = 0; j < n; j++) {
                    var x = j;
                    var y = (offset+j)%n;

                    //console.log("Comparing a["+x+"] <-> b["+y+"]");

                    if (Math.abs(orderedGaps1[x] - orderedGaps2[y]) < tolerance) {
                        matchedGaps++;
                    }
                }

                if (matchedGaps == n) {
                    //console.log("match with offset" + offset);
                    return true;
                }
                //console.log("no match with offset" + offset);
            }

            //console.log("no match with any offset!");
            return false;
        }

        private static getGapsInOrder(notchAnglesInAscendingOrder: number[]) : number[] {
            var gapsInOrder = [];
            var n = notchAnglesInAscendingOrder.length;

            if (n == 1) {
                return [ 2*Math.PI ];
            }

            if (n == 2) {
                var smallerAngle = this.getSmallestAngleBetweenTwoAngles(notchAnglesInAscendingOrder[0], notchAnglesInAscendingOrder[1]);
                return [  smallerAngle, (2*Math.PI - smallerAngle) ];
            }

            for (var i = 0; i < n; i++) {
                gapsInOrder[i] = this.getSmallestAngleBetweenTwoAngles(notchAnglesInAscendingOrder[i], notchAnglesInAscendingOrder[(i+1)%n]);
            }

            return gapsInOrder;
        }

        private static getSmallestAngleBetweenTwoAngles(a: number, b: number) : number {
            return Math.min((2 * Math.PI) - Math.abs(a - b), Math.abs(a - b));
        }

        private static normalizeAngleFromZeroToTwoPi(angle: number) : number {
            var twoPi = 2 * Math.PI;
            var delta = twoPi;
            if (angle >= twoPi) {
                delta = -twoPi;
            } else if (angle >= 0) {
                return angle;
            }

            var result = angle;
            while (result < 0 || result >= twoPi) {
                result += delta;
            }

            return result;
        }
    }   
}