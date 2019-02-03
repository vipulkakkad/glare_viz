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
                    notchAngles);
            }

            this.setNotchEquivalenceClasses(gameParams.gearIntrinsics);
        }

        private static getNotchAngles(pegs: PegSpec[], currentIndex: number, adjacentIndices: number[]) {
            var angles = [];
            var currentPoint = pegs[currentIndex];

            for (var i = 0; i < adjacentIndices.length; i++) {
                var adjacentPoint = pegs[adjacentIndices[i]];
                angles[i] = Math.atan2(adjacentPoint.y - currentPoint.y, adjacentPoint.x - currentPoint.x);
            }

            return angles;
        }

        private static setNotchEquivalenceClasses(gearIntrinsics: HollowGearIntrinsics[]) {
            var tolerance = 0.2;

            var normalizedNotchAngles = [];
            for (var i = 0; i < gearIntrinsics.length; i++) {
                normalizedNotchAngles[i] = this.normalizeNotchAnglesAsBeginningFromLargestGap(gearIntrinsics[i].NotchAngles);
            }

            var currentEquivalenceClass = 0;
            gearIntrinsics[0].NotchEquivalenceClass = currentEquivalenceClass;
            for (var i = 1; i < gearIntrinsics.length; i++) {
                var j = 0;
                while(gearIntrinsics[i].NotchEquivalenceClass < 0 && j < i) {
                    if (this.AreInSameNotchEquivalenceClass(normalizedNotchAngles[i], normalizedNotchAngles[j], tolerance)) {
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
                    angles: JSON.stringify(normalizedNotchAngles[i]),
                    rawangles: gearIntrinsics[i].NotchAngles
                };
                console.log(logObj);
            }
        }

        private static AreInSameNotchEquivalenceClass(normalizedAngles1: number[], normalizedAngles2: number[], tolerance: number) : boolean {
            if (normalizedAngles1.length != normalizedAngles2.length) {
                return false;
            }

            for (var i = 0; i < normalizedAngles1.length; i++) {
                var difference = Math.abs(normalizedAngles1[i] - normalizedAngles2[i]);
                if (difference > tolerance) {
                    return false;
                }
            }

            return true;
        }

        private static normalizeNotchAnglesAsBeginningFromLargestGap(notchAngles: number[]) : number[] {
            if (notchAngles.length == 1)
            {
                return [0];
            }

            if (notchAngles.length == 2)
            {
                var a = notchAngles[0];
                var b = notchAngles[1];
                var gap = Math.min((2 * Math.PI) - Math.abs(a - b), Math.abs(a - b));
                return [0, gap];
            }

            var sortedNotchAngles = notchAngles.sort((n1,n2) => n2 - n1);

            var notchCount = notchAngles.length;
            var largestGap = 0;
            var indexOfNotchAngleBeforeLargestGap = -1;

            var gaps = [];
            
            for (var i = 0; i < notchCount; i++) {
                var a = sortedNotchAngles[(i+1) % notchCount];
                var b = sortedNotchAngles[i];
                var gapToNext = Math.min((2 * Math.PI) - Math.abs(a - b), Math.abs(a - b));
                gaps[i] = gapToNext;
                if (largestGap <= gapToNext) {
                    indexOfNotchAngleBeforeLargestGap = i;
                    largestGap = gapToNext;
                }
            }

            var notchAngleBeforeLargestGap = sortedNotchAngles[indexOfNotchAngleBeforeLargestGap];
            var notchAnglesBeginningBeforeLargestGap = [];
            for (var i = 0; i < notchCount; i++) {
                notchAnglesBeginningBeforeLargestGap[i] = this.normalizeAngleFromZeroToTwoPi(sortedNotchAngles[i] - notchAngleBeforeLargestGap);
            }

            var deltas = []
            var gaps = []
            for (var i = 0; i < notchCount; i++) {
                deltas[i] = notchAnglesBeginningBeforeLargestGap[i] - sortedNotchAngles[i];
                gaps[i] = this.normalizeAngleFromZeroToTwoPi(notchAnglesBeginningBeforeLargestGap[(i+1)%notchCount] - notchAnglesBeginningBeforeLargestGap[i]);
            }
            
            var logObj = {
                // sortedNotchAngles: sortedNotchAngles,
                // notchAnglesBeginningBeforeLargestGap: notchAnglesBeginningBeforeLargestGap,
                deltas: deltas,
                gaps: gaps
            }

//            console.log(logObj);

            return notchAnglesBeginningBeforeLargestGap;
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