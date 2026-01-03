export interface Listing {
    id: string;
    brand: string;
    model: string;
    condition: string;
    storage: string;
    color: string;
    price: number;
    description: string;
    imageUrls: string[];
    sellerName: string;
    sellerId: string;
    createdAt: any;
}