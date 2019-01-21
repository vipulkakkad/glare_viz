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
                return;
            }
            
            if (this.SelectedGear != null) {
                this.SelectedGear.SpinOneClick(isUpwards);
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

        private EvaluateGearStates() : void {
            console.log("Expected radii");

            var numPegsWithCorrectGear = this.Pegs.reduce( function (n, peg) {
                if (peg.CurrentGear != null)
                {
                    return n + ((peg.CurrentGear.Radius == peg.Spec.expectedGearRadius) ? 1 : 0)
                } else {
                    return n;
                }
            }, 0);
            
            console.log("numPegsWithCorrectGear = " + numPegsWithCorrectGear);

            if (numPegsWithCorrectGear == this.Pegs.length)
            {
                alert("Congrats!");
                this.allGearsInPlace = true;
            }
        }
    }
}