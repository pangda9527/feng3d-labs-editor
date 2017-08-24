declare module feng3d {
    class ObjectViewEvent extends egret.Event {
        static VALUE_CHANGE: string;
        space: any;
        attributeName: string;
        attributeValue: any;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        toString(): string;
    }
}
