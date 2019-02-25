module GlareSim {
    export class HollowGearIntrinsics {
        constructor(
            innerRadius: number,
            innerToothAmplitude: number,
            outerRadius: number,
            outerToothAmplitude: number,           
            toothCount: number,
            height: number,
            holeAngle: number,
            holeDeviation: number,
            notchAngles: number[],
            notchPointRadius: number = 0,
            notchBaseRadius: number = 0,
            notchAngleSubtended: number = 0) {
            this.InnerRadius = innerRadius;
            this.InnerToothAmplitude = innerToothAmplitude;
            this.OuterRadius = outerRadius;
            this.OuterToothAmplitude = outerToothAmplitude;

            this.ToothCount = toothCount;
            this.Height = height;

            this.NotchAngles = notchAngles;
            this.NotchPointRadius = notchPointRadius;
            this.NotchBaseRadius = notchBaseRadius;
            this.NotchAngleSubtended = notchAngleSubtended;

            this.HoleAngle = holeAngle;
            this.HoleDeviation = holeDeviation;
        }

        InnerRadius: number;
        InnerToothAmplitude: number;
        OuterRadius: number;
        OuterToothAmplitude: number;
        ToothCount: number;
        Height: number;

        HoleAngle: number;
        HoleDeviation : number;

        NotchAngles: number[];
        NotchPointRadius: number;
        NotchBaseRadius: number;
        NotchAngleSubtended: number;

        public NotchEquivalenceClass: number = -1;
    }
}