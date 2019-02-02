module GlareSim {
    export type UiPegMeshMetadataSetter = (mesh:any, gamePeg: GamePeg) => void;
    export type UiLabelTextureMaker = (gamePeg: GamePeg) => any;
    export type UiTextureTextDrawer = (texture:any, text: string, bgColor: Color) => void;

    export class GamePeg {
        public Spec: PegSpec;
        id: number;

        private Mesh: any; // BABYLON.Mesh
        private LabelTexture: any;

        private SetVertexColor: UiMeshVertexColorSetter;
        private SetLabelTextAndColor: UiTextureTextDrawer;
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
            uiMeshMetadataSetter: UiPegMeshMetadataSetter,
            uiLabelMaker: UiLabelTextureMaker,
            uiTextureTextDrawer: UiTextureTextDrawer) {

            // Re-using the GearMeshGen
            var pegGearSpec = new GearSpec();
            pegGearSpec.Radius = pegRadius;
            pegGearSpec.ToothAmplitude = 0;
            pegGearSpec.ToothCount = 4;

            var gearIntrinsics = new GearIntrinsics(pegGearSpec, pegHeight, []);
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

            this.LabelTexture = uiLabelMaker(this);
            this.SetLabelTextAndColor = uiTextureTextDrawer;
        }

        public SetColor(color: Color): void {
            this.SetVertexRangeColor(this.firstVertexId, this.lastVertexId, color);
        }

        public SetLabelColor(color: Color): void {
            this.SetLabelTextAndColor(this.LabelTexture, this.Spec.letter, color);
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