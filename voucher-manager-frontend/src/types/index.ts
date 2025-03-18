export interface Shop {
    id: string; // UUID string
    name: string;
    backgroundColor: string;
    iconUrl: string;
}

export interface Voucher {
    id: string; // UUID string
    code: string;
    createdAt: string;
    redeemedAt: string | null;
    shopId: string; // UUID string, changed from nested shop object
}