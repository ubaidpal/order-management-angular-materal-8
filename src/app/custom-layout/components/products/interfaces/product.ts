export class IonPoint {
    anion?: string;
    countUgCm1?: string
}
export class Product {

    ion_points: IonPoint[];

    constructor(Product) {
        this.ion_points = Product.ion_points &&  Product.ion_points || [];
      }
}



