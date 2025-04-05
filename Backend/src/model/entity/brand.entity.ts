import { BaseEntity } from "./base.entity";

export class Brand extends BaseEntity {
    id: number;
    name: string;
    description?: string;
    logoURL?: string;
}
