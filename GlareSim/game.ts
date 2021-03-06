module GlareSim {
    export class Game {
        private SelectedGear: GameGear = null;

        private selectedGearColor: Color = new Color(0, 0.66, 0, 1);
        private defaultGearColor: Color = new Color(0.2, 0.7, 1, 1);

        public Pegs: GamePeg[];
        public Gears: GameGear[];
        public RimGear: GameGear;
        
        private allGearsInPlace: boolean = false;

        constructor(
            pegs: GamePeg[],
            gears: GameGear[],
            rimGear: GameGear,
            randomize: boolean) {
            this.Pegs = pegs;
            this.Gears = gears;
            this.RimGear = rimGear;

            if (randomize)
            {
                for (var i = 0; i < this.Gears.length; i++) {
                    this.Gears[i].SpinByAngle(Math.random() * 2 * Math.PI, true);
                }    
            }
        }

        public WillHandleScroll() : boolean {
            return (this.allGearsInPlace || this.SelectedGear != null);
        }

        public OnGearClicked(clickedGear: GameGear) {
            console.log(clickedGear.GetMeshId());
            console.log(clickedGear.Intrinsics.NotchEquivalenceClass);
            if (this.allGearsInPlace) {
                return;
            }

            if (clickedGear == this.RimGear) {
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

            if (clickedGear == this.RimGear) {
                return;
            }

            this.ResetGearPosition(clickedGear);
            // this.EvaluateGearStates();
        }

        public OnScroll(isUpwards: boolean) {            
            if (this.allGearsInPlace) {
                this.SpinAllGears(0.1, isUpwards);
                return;
            }

            this.SelectedGear.SpinOneClick(isUpwards);
            // this.EvaluateGearStates();
        }

        public OnPegClicked(clickedPeg: GamePeg) {            
            if (this.allGearsInPlace) {
                return;
            }

            if (this.SelectedGear != null) {
                this.SelectedGear.PlaceAtPeg(clickedPeg);
                // this.EvaluateGearStates();
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

        public OnOutsideClicked() {
            this.OnBoardClicked();
        }

        private UnSelectGear() {
            if (this.SelectedGear == null) {
                return;
            }
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

        private SpinAllGears(tangentialDistance: number, clockwise: boolean) {
            for (var i = 0; i < this.Pegs.length; i++) {
                var gear = this.Pegs[i].CurrentGear;
                var spinAngle = tangentialDistance / gear.Radius;
                gear.SpinByAngle(spinAngle, this.Pegs[i].Spec.isPositiveChirality ? clockwise : !clockwise)
            }

            var rimSpinAngle = tangentialDistance / this.RimGear.Radius;
            this.RimGear.SpinByAngle(rimSpinAngle, clockwise)
        }

        public Solve() {
            for (var i = 0; i < this.Gears.length; i++) {
                this.Gears[i].PlaceAtPeg(this.Pegs[i]);
//                this.Gears[i].SpinByAngle(this.Pegs[i].Spec.axisAngle + (this.Pegs[i].Spec.isPositiveChirality ? 0 : Math.PI/2), true);
            }
            this.EvaluateGearStates();
        }

        private EvaluateGearStates() : void {
            for (var i = 0; i < this.Pegs.length; i++)
            {
                var peg = this.Pegs[i];
                if (peg.CurrentGear == null) {
                    return;
                } else if (peg.CurrentGear.Radius != peg.Spec.expectedGearRadius) {
                    return;
                }
            }

            this.UnSelectGear();
            this.allGearsInPlace = true;
            alert("You can scroll to spin the outer gear now! (all other interactions disabled)");
        }
    }
}