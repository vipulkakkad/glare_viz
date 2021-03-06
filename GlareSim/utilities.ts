module GlareSim {
    export type UiMeshXYLineDrawer = (x1: number, y1: number, x2: number, y2: number, meshName: string) => void;
    export type UiTextureXYCharacterDrawer = (x: number, y: number, tileWidth: number, text: string) => void;

    export class Utilities {
        public static rotateWholeSetup(gameParams: GameParameters, rotateBy: number) {
            var xCenter = gameParams.xMax / 2;
            var yCenter = gameParams.yMax / 2;

            var n = gameParams.pegs.length;

            for (var i = 0; i < n; i++) {
                var xDelta = gameParams.pegs[i].x - xCenter;
                var yDelta = gameParams.pegs[i].y - yCenter;

                var thetaOriginal = Math.atan2(yDelta, xDelta);
                var radius = Math.sqrt(xDelta * xDelta + yDelta * yDelta);

                var thetaNew = thetaOriginal + rotateBy;

                gameParams.pegs[i].x = xCenter + radius * Math.cos(thetaNew);
                gameParams.pegs[i].y = yCenter + radius * Math.sin(thetaNew);
            }
        }

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
            deviationsFromSingleNotch[6] = -1;

            var deviationsFromZeroForUnique = [];
            deviationsFromZeroForUnique[0] = Math.PI;
            deviationsFromZeroForUnique[2] = 1.7 * Math.PI;
            deviationsFromZeroForUnique[4] = 0.5 * Math.PI;
            deviationsFromZeroForUnique[7] = 1.25 * Math.PI;
            deviationsFromZeroForUnique[8] = Math.PI;
            deviationsFromZeroForUnique[11] = 1.75 * Math.PI;
            deviationsFromZeroForUnique[12] = 0.5 * Math.PI;

            for (var i = 0; i < gameParams.gearIntrinsics.length; i++) {
                var notchEquivalenceClass = gameParams.gearIntrinsics[i].NotchEquivalenceClass;
                switch(notchEquivalenceClass)
                {
                    case 3:
                    case 6:
                        gameParams.gearIntrinsics[i].HoleAngle = 
                            gameParams.gearIntrinsics[i].NotchAngles[0] + 
                            deviationsFromSingleNotch[notchEquivalenceClass];
                        break;
                    case 2:
                    case 7:
                    case 11:
                    case 12:
                        gameParams.gearIntrinsics[i].HoleAngle =
                            deviationsFromZeroForUnique[notchEquivalenceClass];
                        break;
                    case 1:
                    case 8:
                    case 9:
                    case 10:
                    case 5:
                    case 4:
                    case 0:
                        gameParams.gearIntrinsics[i].InnerRadius = 0;
                        gameParams.gearIntrinsics[i].InnerToothAmplitude = 0;
                    default:
                        break;
                }                    
            }
        }

        public static drawCharactersInHoles(gameParams: GameParameters, drawCharacter: UiTextureXYCharacterDrawer) {
            var characters = [];
            characters[15] = ["E", "E", "J", "E", "W" ]; // L
            characters[16] = ["V", "N", "O", "D", "I" ]; // L
            characters[3]  = ["E", "R", "H", "W", "L" ]; // S
            characters[8]  = ["R", "I", "A", "I", "H" ]; // L
            characters[9]  = ["Y", "C", "N", "N", "E" ]; // S
            characters[4]  = ["T", "O", "N", "T", "L" ]; // S
            characters[7]  = ["W", "E", "E", "U", "M" ]; // L
            characters[12] = ["O", "X", "S", "N", "B" ]; // L
            characters[24] = ["M", "P", "E", "I", "O" ]; // L
            characters[13] = ["I", "L", "L", "N", "N" ]; // S
            characters[27] = ["N", "O", "L", "G", "E" ]; // S
            characters[28] = ["U", "S", "I", "F", "R" ]; // S
            characters[17] = ["T", "I", "P", "O", "A" ]; // L
            characters[19] = ["E", "V", "S", "R", "Y" ]; // L
            characters[20] = ["S", "E", "E", "K", "S" ]; // S

            var small = [0, 1, 2, 3, 4];
            var large = [0, 2, 4, 1, 3]

            for (var i = 0; i < gameParams.gearIntrinsics.length; i++) {
                if (characters[i] != null) {
                    var peg = gameParams.pegs[i];
                    var angleDeviationDirection = peg.isPositiveChirality ? -1 : 1;

                    var gearIntrinsics = gameParams.gearIntrinsics[i];
                   
                    var n = characters[i].length;
                    for (var j = 0; j < n; j++)
                    {
                        var theta = gearIntrinsics.HoleAngle + (angleDeviationDirection * (j / n) * (2*Math.PI));

                        var xHole = peg.x + (gearIntrinsics.HoleDeviation * Math.cos(theta));
                        var yHole = peg.y + (gearIntrinsics.HoleDeviation * Math.sin(theta));
    
                        var charIndex = gearIntrinsics.OuterRadius > 4.5 ? large : small;
                        var character = characters[i][charIndex[j]];
                        drawCharacter(xHole, yHole, gearIntrinsics.InnerRadius, character);    
                    }
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
            var holeDeviation = 1.5;
            
            for (var j = 0; j < n; j++) {
                var notchAngles = Utilities.getNotchAngles(gameParams.pegs, j, edges[j]); 
                var sortedNotchAngles = notchAngles.sort((n1,n2) => n1 - n2);

                gameParams.gearIntrinsics[j] = new GlareSim.HollowGearIntrinsics(
                    holeRadius,
                    0,
                    gameParams.pegs[j].expectedGearRadius,
                    gameParams.toothAmplitude,
                    12 * gameParams.pegs[j].expectedGearRadius,
                    gameParams.gearHeight,
                    0,
                    holeDeviation,
                    sortedNotchAngles,
                    gameParams.pegs[j].expectedGearRadius - gameParams.toothAmplitude - 0.1,
                    gameParams.pegRadius + 0.1,
                    Math.PI / 9);
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