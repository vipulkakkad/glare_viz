module GlareSim {
    export type UiPegMeshMetadataSetter = (mesh:any, gamePeg: GamePeg) => void;

    export class GamePeg {
        public Spec: PegSpec;
        id: number;

        private Mesh: any; // BABYLON.Mesh

        private SetVertexColor: UiMeshVertexColorSetter;
        private firstVertexId: number;
        private lastVertexId: number;

        public Type: string = "GamePeg";

        public CurrentGear: GameGear;

        constructor(
            pegRadius: number,
            pegHeight: number,
            pegSpec: PegSpec,
            uiMeshMaker: UiMeshMaker,
            uiVertexColorSetter: UiMeshVertexColorSetter,
            uiPositionSetter: UiMeshXYPositionSetter,
            uiMeshMetadataSetter: UiPegMeshMetadataSetter) {

            // Re-using the GearMeshGen
            var gearIntrinsics = new GearIntrinsics(pegRadius, 0, 4, pegHeight, []);
            var gearMeshGen = new GearMeshGenerator(gearIntrinsics, new Color(1, 1, 1, 1));
            this.firstVertexId = gearMeshGen.FirstGearVertex;
            this.lastVertexId = gearMeshGen.LastGearVertex

            var gearGeometry = gearMeshGen.GenerateGeometry();           
            this.Mesh = uiMeshMaker(gearGeometry);

            this.SetVertexColor = uiVertexColorSetter;
    
            this.Spec = pegSpec;
            uiPositionSetter(this.Mesh, this.Spec.x, this.Spec.y);

            uiMeshMetadataSetter(this.Mesh, this);

            this.CurrentGear = null;
        }

        public SetColor(color: Color): void {
            this.SetVertexRangeColor(this.firstVertexId, this.lastVertexId, color);
        }

        private SetVertexRangeColor(start: number, end: number, color: Color): void {
            for (var i = start; i <= end; i++) {
                if (i >= 0) {
                    this.SetVertexColor(this.Mesh, i, color);
                }
            }
        }   
    }
}