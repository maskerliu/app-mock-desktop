import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "JsonViewer",
  components: {},
})
export default class JsonViewer extends Vue {
  @Prop({ required: true })
  data: any;

  @Prop({ default: "" })
  jsonKey: string;

  @Prop({ default: false })
  closed: boolean;

  @Prop({ default: true })
  isLast: boolean;

  @Prop({ default: 12 })
  fontSize: number;

  @Prop({ default: 24 })
  lineHeight: number;

  @Prop({ default: 3 })
  deep: number;

  @Prop({ default: 1 })
  currentDeep: number;

  @Prop({ default: "" })
  theme: String;

  @Prop({ default: true })
  hasSiblings: boolean;

  @Prop()
  onItemClick: Function;

  private innerclosed: boolean = true;
  private templateDeep: number = 1;
  private visible: boolean = this.currentDeep < 4;

  mounted() {
    this.innerclosed = this.closed;
    this.templateDeep = this.currentDeep;
    setTimeout(() => {
      this.visible = true;
    }, 0);
  }

  get isArray() {
    return this.getDataType(this.data) === "array";
  }

  get length() {
    if (this.data == null) {
      return 0;
    } else {
      return this.isArray ? this.data.length : Object.keys(this.data).length;
    }
  }

  get subfix() {
    const data = this.data;
    if (this.isEmptyArrayOrObject(data)) {
      return "";
    } else {
      return (this.isArray ? "]" : "}") + (this.isLast ? "" : ",");
    }
  }

  get prefix() {
    return this.isArray ? "[" : "{";
  }

  get items() {
    const json = this.data;
    if (this.isArray) {
      return json.map((item) => {
        const isJSON = this.isObjectOrArray(item);
        return { value: item, isJSON, key: "" };
      });
    }

    return Object.keys(json).map((key) => {
      const item = json[key];
      const isJSON = this.isObjectOrArray(item);
      return { value: item, isJSON, key };
    });
  }

  get iconColors() {
    return ["#747983", "#747983"];
  }

  getDataType(data: any) {
    return Object.prototype.toString
      .call(data)
      .slice(8, -1)
      .toLowerCase();
  }

  isObjectOrArray(source: any) {
    return ["array", "object"].includes(this.getDataType(source));
  }

  toggleClose() {
    if (this.length === 0) {
      return;
    }
    if (this.innerclosed) {
      this.innerclosed = false;
    } else {
      this.innerclosed = true;
    }
  }
  isClose(curDeep: number) {
    return curDeep > this.deep;
  }

  isEmptyArrayOrObject(data: any) {
    // 空数组或者空对象
    return [{}, []]
      .map((item) => JSON.stringify(item))
      .includes(JSON.stringify(data));
  }

  @Watch("closed")
  onClosed() {
    this.innerclosed = this.closed;
  }
}
