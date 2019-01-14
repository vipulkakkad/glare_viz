module GlareSim {
    export class GameBoard {
        Pegs: GamePeg[];

        constructor(
            xMax: number,
            yMax: number,
            gamePegPositions: GamePegPosition[]) {
        
            this.Pegs = [];
        
            for (var i = 0; i < gamePegPositions.length; i++) {
                // var peg = new GamePeg();
                // peg.id = i;
                // peg.position = gamePegPositions[i];
                // this.Pegs[i] = peg;
            }
        }
    }
}