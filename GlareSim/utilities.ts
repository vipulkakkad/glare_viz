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
                                console.log(target + " -> " + partition[target]);
                            }
                        }    
                    }
                }
            }

            for (var j = 0; j < n; j++) {
                gameParams.pegs[j].startsClear = partition[j];
                gameParams.gears[j].ToothCount *= 2;
            }
        }

        public static createGearIntrinsicsFromGearSpecs(
            gameParams: GameParameters,
            edges: number[][]) {

            var n = gameParams.pegs.length;
            gameParams.gearIntrinsics = [];
            
            for (var j = 0; j < n; j++) {
                var notchAngles = Utilities.getNotchAngles(gameParams.pegs, j, edges[j]); 
                var gearSpec = gameParams.gears[j];
                gameParams.gearIntrinsics[j] = new GlareSim.GearIntrinsics(gearSpec, gameParams.gearHeight, notchAngles);
            }
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
    }   
}