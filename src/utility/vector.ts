export class Vector2 {
    public x: number;
    public y: number;

    constructor(x?:number, y?:number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    dot2(x, y) {
        return this.x * x + this.y * y;
    };

    isInsideBounds(topLeft: Vector2, bottomRight: Vector2) {
        return (this.x  >= topLeft.x && this.x <= bottomRight.x
                && this.y >= topLeft.y && this.y <= bottomRight.y);
    }

}

export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x?:number, y?:number, z?:number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    dot2(x, y) {
        return this.x * x + this.y * y;
    };

    dot3(x, y, z) {
        return this.x * x + this.y * y + this.z * z;
    }
}