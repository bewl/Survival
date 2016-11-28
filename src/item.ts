import {ItemInterface} from './item-interface';

export class Item implements ItemInterface {
    id:string;
    title:string;
    description:string;
    category:string;
    lifespan:number;
    volume:number;
    weight:number;
    module:string;

    constructor() {
        //TODO need a mapper for this
        this.id = "";
        this.title = "";
        this.description ="";
        this.category = "";
        this.lifespan = 0;
        this.volume = 0;
        this.weight = 0;
        this.module = "";
    }
    
    testfunc() {
        alert("TEST!");
    }

    use() {
        debugger;
        const mod = require('./item-modules/' + this.module);

    }
}