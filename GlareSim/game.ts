module GlareSim {
    export class Game {
        public SelectedGear: GameGear = null;

        private selectedGearColor: Color = new Color(0, 0.66, 0, 1);
        private defaultGearColor: Color = new Color(0.2, 0.7, 1, 1);

        constructor() {
        }

        public OnGearClicked(clickedGear: GameGear) {
            if (this.SelectedGear != null) {
                this.UnSelectGear();
            }
            this.SelectGear(clickedGear);
        }

        public OnGearDoubleClicked(clickedGear: GameGear) {
            this.ResetGearPosition(clickedGear);
        }

        public OnScroll(isUpwards: boolean) {
            if (this.SelectedGear != null) {
                this.SelectedGear.SpinOneClick(isUpwards);
            }
        }

        public OnPegClicked(clickedPeg: GamePeg) {
            if (this.SelectedGear != null) {
                this.SelectedGear.SetToPegPosition(clickedPeg.Spec);
            }
        }

        public OnBoardClicked() {
            if (this.SelectedGear != null) {
                this.UnSelectGear()
            }
        }

        private UnSelectGear() {
            this.SelectedGear.SetGearColor(this.defaultGearColor);
            this.SelectedGear = null;
        }

        private SelectGear(gear: GameGear) {
            this.SelectedGear = gear;
            gear.SetGearColor(this.selectedGearColor);
        }

        private ResetGearPosition(gear: GameGear) {
            gear.SetToDefaultPosition();
        }
    }
}