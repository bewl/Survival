export class Health {
    parts:Array<any>;
    head: number = 100;
    torso: number = 100;
    leftArm: number = 100;
    rightArm: number = 100;
    leftHand: number = 100;
    rightHand: number = 100;
    leftLeg: number = 100;
    rightLeg: number = 100;
    leftFoot: number = 100;
    rightFoot: number = 100;

    constructor() {
        this.parts = [
            {id: 'head', description: 'Head', value: 100},
            {id: 'torso', description: 'Torso', value: 100},
            {id: 'leftArm', description: 'Left Arm', value: 100},
            {id: 'rightArm', description: 'Right Arm', value: 100},
            {id: 'leftHand', description: 'Left Hand', value: 100},
            {id: 'rightHand', description: 'Right Hand', value: 100},
            {id: 'leftLeg', description: 'Left Leg', value: 100},
            {id: 'rightLeg', description: 'Right Leg', value: 100},
            {id: 'leftFoot', description: 'Left Foot', value: 100},
            {id: 'rightFoot', description: 'Right Foot', value: 100},

        ]
    }

    damage(partId:string, value:number) {
        //find part
        let part = this.parts.find(p => p.id === partId);

        part.value -= value;
        //apply value (create rules as well)
    }

    heal(partId:string, value:number) {
        //find part
        let part = this.parts.find(p => p.id === partId);

        part.value += value;
        //apply value (create rules as well)
    }
}