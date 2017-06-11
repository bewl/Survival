import { inject } from 'aurelia-framework';
import { Player } from '../actor/player';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Player, EventAggregator)
export class Input {
    private player: Player;
    private eventAggregator: EventAggregator;
    private boundHandler;
    private mouseWheelHandler;
    private mouseMoveHandler;
    private lastPressed = 0;
    constructor(player, ea) {
        this.player = player;
        this.mouseMoveHandler = this.handleMouseMove.bind(this);
        this.boundHandler = this.handleKeyInput.bind(this);
        this.mouseWheelHandler = this.handleMouseWheel.bind(this);
        window.addEventListener('keypress', this.boundHandler, false);
        window.addEventListener('mousewheel', this.mouseWheelHandler, false);
        //window.addEventListener('mousemove', this.mouseMoveHandler, false);
        this.eventAggregator = ea;
    }

    deactivate() {
        window.removeEventListener('keypress', this.boundHandler);
        window.removeEventListener('mousewheel', this.mouseWheelHandler);
        window.removeEventListener('mousemove', this.mouseMoveHandler);
    }

    movePlayer(direction: string) {
        this.player.move(direction, 1);
    }

    throttle(callback, wait, context = this) {
        let timeout = null
        const later = () => callback()

        return function () {
            clearTimeout(timeout)
            timeout = setTimeout(later, wait);
        }
    }

    handleMouseWheel(event) {
        var e = event;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        this.eventAggregator.publish('ZoomChanged', delta);
    }

    handleMouseMove(event) {
        this.eventAggregator.publish('MouseMoved', event);
    }

    handleKeyInput(event) {
        let time = new Date().getTime();
        let delta = 55;
        let diagDelta = delta * 2;

        if (time > this.lastPressed + delta) {
            switch (event.code.toUpperCase()) {
                case "65":
                    break;
                case "66":
                    break;
                case "KEYC":
                    this.player.collisionEnabled = !this.player.collisionEnabled;
                    break;
                case "KEYE":
                    this.player.use();
                    break;
                case "NUMPAD1":
                    this.movePlayer('sw');
                    time += diagDelta;
                    break;
                case "NUMPAD2":
                    this.movePlayer('s');
                    break;
                case "NUMPAD3":
                    this.movePlayer('se');
                    time += diagDelta;
                    break;
                case "NUMPAD4":
                    this.movePlayer('w');
                    break;
                case "NUMPAD6":
                    this.movePlayer('e');
                    break;
                case "NUMPAD7":
                    this.movePlayer('nw');
                    time += diagDelta;
                    break;
                case "NUMPAD8":
                    this.movePlayer('n');
                    break;
                case "NUMPAD9":
                    this.movePlayer('ne');
                    time += diagDelta;
                    break;
            }

            this.lastPressed = time;
        }
    }
}