export interface ItemInterface {
    id:string;
    title:string;
    description:string;
    category:string;
    lifespan:number;
    volume:number;
    weight:number;
    module:string;

    use();
}