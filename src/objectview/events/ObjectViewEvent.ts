module feng3d {

	export class ObjectViewEvent extends egret.Event {
		static VALUE_CHANGE: string;
		space: any;
		attributeName: string;
		attributeValue: any;

		constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
			super(type, bubbles, cancelable);
		}

		toString(): string {
			return "[{0} type=\"{1}\" space=\"{2}\"  attributeName=\"{3}\" attributeValue={4}]".replace("{0}", egret.getQualifiedClassName(this).split("::").pop()).replace("{1}", this.type).replace("{2}", egret.getQualifiedClassName(this).split("::").pop()).replace("{3}", this.attributeName).replace("{4}", JSON.stringify(this.attributeValue));
		}

	}
}

