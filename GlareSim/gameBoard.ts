module GlareSim {
    export type UiBoardMeshMetadataSetter = (mesh:any, gameBoard: GameBoard) => void;

    export class GameBoard {
        private Mesh: any; // BABYLON.Mesh

        public Type: string = "GameBoard";

        constructor(
            xMax: number,
            yMax: number,
            boardHeight: number,
            uiMeshMaker: UiMeshMaker,
            uiMeshMetadataSetter: UiBoardMeshMetadataSetter) {

            var meshGen = new BoardMeshGenerator(xMax, yMax, boardHeight);

            var geometry = meshGen.GenerateGeometry();           
            this.Mesh = uiMeshMaker(geometry);

            uiMeshMetadataSetter(this.Mesh, this);    
        }
    }
}