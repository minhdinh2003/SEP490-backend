import { AutoMap } from "@automapper/classes";
import { BaseDto } from "./base.dto";

export class BrandDto extends BaseDto {
    @AutoMap()
    id: number;

    @AutoMap()
    name: string;

    @AutoMap()
    description?: string;

    @AutoMap()
    logoURL?: string;
}
