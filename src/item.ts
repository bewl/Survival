import {inject} from 'aurelia-framework';
import * as enums from './itemenums';

export interface Item {
    title:string;
    description:string;
    category:string;
    lifespan:number;
    volume:number;
    weight:number;
    module:string;
}