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
            notchAngles: number[]) {
            this.InnerRadius = innerRadius;
            this.InnerToothAmplitude = innerToothAmplitude;
            this.OuterRadius = outerRadius;
            this.OuterToothAmplitude = outerToothAmplitude;

            this.ToothCount = toothCount;
            this.Height = height;
            this.NotchAngles = notchAngles;

            this.HoleAngle = holeAngle;
            this.HoleDeviation = holeDeviation;
        }

        InnerRadius: number;
        InnerToothAmplitude: number;
        OuterRadius: number;
        OuterToothAmplitude: number;
        ToothCount: number;
        Height: number;
        NotchAngles: number[];
        HoleAngle: number;
        HoleDeviation : number;
    }
}