module GlareSim {
    export class Game {
        public SelectedGear: GameGear = null;

        private selectedGearColor: Color = new Color(0, 0.66, 0, 1);
        private defaultGearColor: Color = new Color(0.2, 0.7, 1, 1);

        constructor() {

        }

        public OnGearClicked(clickedGear: GameGear) {
            if (this.SelectedGear != null) {
                this.UnSelectGear(this.SelectedGear);
            }
            this.SelectGear(clickedGear);
        }

        public OnPegClicked(clickedPeg: GamePeg) {
            if (this.SelectedGear != null) {
                this.SelectedGear.SetToPegPosition(clickedPeg.position);
            }
        }

        private UnSelectGear(gear: GameGear) {
            gear.SetGearColor(this.defaultGearColor);
        }

        private SelectGear(gear: GameGear) {
            this.SelectedGear = gear;
            gear.SetGearColor(this.selectedGearColor);
        }
    }
}