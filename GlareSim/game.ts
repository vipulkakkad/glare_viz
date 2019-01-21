module GlareSim {
    export class Game {
        public SelectedGear: GameGear = null;

        private selectedGearColor: Color = new Color(0, 0.66, 0, 1);
        private defaultGearColor: Color = new Color(0.2, 0.7, 1, 1);

        public Pegs: GamePeg[];
        private allGearsInPlace: boolean = false;

        constructor() {
            this.Pegs = [];
        }

        public OnGearClicked(clickedGear: GameGear) {
            if (this.allGearsInPlace) {
                return;
            }

            if (clickedGear == this.SelectedGear) {
                return;
            }

            if (this.SelectedGear != null) {
                this.UnSelectGear();
            }
            this.SelectGear(clickedGear);
        }

        public OnGearDoubleClicked(clickedGear: GameGear) {
            if (this.allGearsInPlace) {
                return;
            }

            this.ResetGearPosition(clickedGear);
            this.EvaluateGearStates();
        }

        public OnScroll(isUpwards: boolean) {            
            if (this.allGearsInPlace) {
                this.SpinAllGears(0.1, isUpwards);
                return;
            }

            if (this.SelectedGear != null) {
                this.SelectedGear.SpinOneClick(isUpwards);
                this.EvaluateGearStates();
            }
        }

        public OnPegClicked(clickedPeg: GamePeg) {            
            if (this.allGearsInPlace) {
                return;
            }
            
            if (this.SelectedGear != null) {
                this.SelectedGear.PlaceAtPeg(clickedPeg);
                this.EvaluateGearStates();
            }
        }

        public OnBoardClicked() {
            if (this.allGearsInPlace) {
                return;
            }

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
            gear.RemoveFromBoard();
        }

        private SpinAllGears(tangentialDistance: number, clockwise: boolean)
        {
            for (var i = 0; i < this.Pegs.length; i++)
            {
                var gear = this.Pegs[i].CurrentGear;
                var spinAngle = tangentialDistance / gear.Radius;
                gear.SpinByAngle(spinAngle, this.Pegs[i].Spec.startsClear ? clockwise : !clockwise)
            }
        }

        private EvaluateGearStates() : void {
            for (var i = 0; i < this.Pegs.length; i++)
            {
                var peg = this.Pegs[i];
                if (peg.CurrentGear == null) {
                    return;
                } else if (peg.CurrentGear.Radius != peg.Spec.expectedGearRadius) {
                    return;
                } else if (peg.Spec.startsClear && peg.CurrentGear.WindowColor < 0.9) {
                    return;
                } else if (!peg.Spec.startsClear && peg.CurrentGear.WindowColor > 0.1) {
                    return;
                }
            }

            this.UnSelectGear();
            this.allGearsInPlace = true;
            alert("Nicely done - you can scroll to spin all the gears together now! (all other interactions disabled)");
        }
    }
}