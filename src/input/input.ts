import { inject } from 'aurelia-framework';
import { Player } from '../actor/player';


@inject(Player)
export class Input {
    private player: Player;
    private boundHandler;
    private lastPressed = 0;
    constructor(player) {
        this.player = player;
        this.boundHandler = this.handleKeyInput.bind(this);
        window.addEventListener('keypress', this.boundHandler, false);
    }

    deactivate() {
        window.removeEventListener('keypress', this.boundHandler);
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

    handleKeyInput(event) {
        let time = new Date().getTime();

        if (time > this.lastPressed + 40) {
            switch (event.code.toUpperCase()) {
                case "65":
                    break;
                case "66":
                    break;
                case "KEYC":
                    this.player.collisionEnabled = !this.player.collisionEnabled;
                    break;
                case "NUMPAD1":
                    this.movePlayer('sw');
                    break;
                case "NUMPAD2":
                    this.movePlayer('s');
                    break;
                case "NUMPAD3":
                    this.movePlayer('se');
                    break;
                case "NUMPAD4":
                    this.movePlayer('w');
                    break;
                case "NUMPAD6":
                    this.movePlayer('e');
                    break;
                case "NUMPAD7":
                    this.movePlayer('nw');
                    break;
                case "NUMPAD8":
                    this.movePlayer('n');
                    break;
                case "NUMPAD9":
                    this.movePlayer('ne');
                    break;
            }

            this.lastPressed = time;
        }
    }
}