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

        constructor(
            pegRadius: number,
            pegHeight: number,
            pegSpec: PegSpec,
            uiMeshMaker: UiMeshMaker,
            uiVertexColorSetter: UiMeshVertexColorSetter,
            uiPositionSetter: UiMeshPositionSetter,
            uiMeshMetadataSetter: UiPegMeshMetadataSetter) {

            // Re-using the GearMeshGen
            var pegGearSpec = new GearSpec();
            pegGearSpec.Radius = pegRadius;
            pegGearSpec.ToothAmplitude = 0;
            pegGearSpec.ToothCount = 4;

            var gearIntrinsics = new GearIntrinsics(pegGearSpec, pegHeight, 0); // windowRadius = 0
            var gearMeshGen = new GearMeshGenerator(gearIntrinsics, false); // false => no window
            this.firstVertexId = gearMeshGen.FirstGearVertex;
            this.lastVertexId = gearMeshGen.LastGearVertex

            var gearGeometry = gearMeshGen.GenerateGeometry();           
            this.Mesh = uiMeshMaker(gearGeometry);

            this.SetVertexColor = uiVertexColorSetter;
    
            this.Spec = pegSpec;
            uiPositionSetter(this.Mesh, this.Spec.x, this.Spec.y);

            uiMeshMetadataSetter(this.Mesh, this);
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