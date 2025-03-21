import 'reflect-metadata';

export function EntityType(type: any) {
    return function (target: any, key: string) {
        Reflect.defineMetadata('design:type', type, target, key);
    };
}

export function ModelType(type: any) {
    return function (target: any, key: string) {
        Reflect.defineMetadata('design:type', type, target, key);
    };
}
