import {Vector2} from '../helpers';

export class PlayerMovedEvent {
    position: Vector2;

    constructor(position: Vector2) {
        this.position = position;
    }
}