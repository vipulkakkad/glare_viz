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

        public static colorGearsBy(colorScheme: string, gameParams: GameParameters, gears: GameGear[]) {
            var colors = [
                new GlareSim.Color(0, 0, 1, 1),
                new GlareSim.Color(0, 1, 0, 1),
                new GlareSim.Color(0, 1, 1, 1),
                new GlareSim.Color(1, 0, 0, 1),
                new GlareSim.Color(1, 0, 1, 1),
                new GlareSim.Color(1, 1, 0, 1),
                new GlareSim.Color(1, 1, 1, 1),
                new GlareSim.Color(0, 0, 0.5, 1),
                new GlareSim.Color(0, 0.5, 0, 1),
                new GlareSim.Color(0, 0.5, 0.5, 1),
                new GlareSim.Color(0.5, 0, 0, 1),
                new GlareSim.Color(0.5, 0, 0.5, 1),
                new GlareSim.Color(0.5, 0.5, 0, 1),
                new GlareSim.Color(0.5, 0.5, 0.5, 1),
            ];

            switch(colorScheme)
            {
                case "Chirality":
                    for (var i = 0; i < gears.length; i++) {
                        var gearColor = gameParams.pegs[i].isPositiveChirality ? 4 : 9;
                        gears[i].SetGearColor(colors[gearColor]);
                    }
                    break;
                case "NotchEquivalence":
                    for (var i = 0; i < gears.length; i++) {
                        var gearColor = gears[i].Intrinsics.NotchEquivalenceClass;
                        gears[i].SetGearColor(colors[gearColor]);
                    }
                    break;
                default:
                    console.log("Not overriding gear color");
                    break;
            }                
        }

        public static setHoleParameters(gameParams: GameParameters) {
            var deviationsFromSingleNotch = [];
            deviationsFromSingleNotch[3] = 1.5;
            deviationsFromSingleNotch[5] = -1;
            deviationsFromSingleNotch[6] = -0.3;

            var deviationsFromZeroForUnique = [];
            deviationsFromZeroForUnique[0] = Math.PI;
            deviationsFromZeroForUnique[2] = 1.6 * Math.PI;
            deviationsFromZeroForUnique[4] = 0.5 * Math.PI;
            deviationsFromZeroForUnique[7] = 0.5 * Math.PI;
            deviationsFromZeroForUnique[8] = Math.PI;
            deviationsFromZeroForUnique[11] = 0.5 * Math.PI;
            deviationsFromZeroForUnique[12] = 1.5 * Math.PI;

            for (var i = 0; i < gameParams.gearIntrinsics.length; i++) {
                var notchEquivalenceClass = gameParams.gearIntrinsics[i].NotchEquivalenceClass;
                switch(notchEquivalenceClass)
                {
                    case 3:
                    case 5:
                    case 6:
                        gameParams.gearIntrinsics[i].HoleAngle = 
                            gameParams.gearIntrinsics[i].NotchAngles[0] + 
                            deviationsFromSingleNotch[notchEquivalenceClass];
                        break;
                    case 0:
                    case 4:
                    case 7:
                    case 11:
                    case 12:
                        gameParams.gearIntrinsics[i].HoleAngle =
                            deviationsFromZeroForUnique[notchEquivalenceClass];
                        break;
                    case 1:
                    case 2:
                    case 8:
                    case 9:
                    case 10:
                        gameParams.gearIntrinsics[i].InnerRadius = 0;
                        gameParams.gearIntrinsics[i].InnerToothAmplitude = 0;
                    default:
                        break;
                }                    
            }
        }

        public static setChiralityInBipartiteManner(
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

            var holeRadius = 0.85;
            
            for (var j = 0; j < n; j++) {
                var notchAngles = Utilities.getNotchAngles(gameParams.pegs, j, edges[j]); 
                var sortedNotchAngles = notchAngles.sort((n1,n2) => n1 - n2);

                gameParams.gearIntrinsics[j] = new GlareSim.HollowGearIntrinsics(
                    holeRadius,
                    0,
                    gameParams.pegs[j].expectedGearRadius,
                    gameParams.toothAmplitude,
                    6 * gameParams.pegs[j].expectedGearRadius,
                    gameParams.gearHeight,
                    0,
                    gameParams.pegs[j].expectedGearRadius - (2 * holeRadius + 0.1),
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

            if (radius1 != radius2) {
                return false;
            }

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