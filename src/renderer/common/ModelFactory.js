class ModelFactory {

    constructor(models) {
        this.models = models;
        this.BaseDataType = ['String', 'Integer', 'List', 'Float', 'Double', 'Boolean', 'Object'];
    }

    generateDataByApi(api) {
        let modelType = api['responseModel'];
        // let mockData = this.generateDataByModel(null, modelType, null, 0);
        // console.log(mockData);

        return this.generateMockDataByModel(modelType);
    }

    generateDataByModel(key, modelType, genericType, deep) {

        let curType = null, tplType = null;
        let space = "";
        for (let i = 0; i < deep; ++i) {
            space += "\t";
        }

        if (modelType.indexOf('<') === -1) { // 不存在泛型定义
            let isBaseType = this.BaseDataType.find((element) => {
                return element === modelType;
            });

            if (!!isBaseType) {
                // console.log("%s%s \t%s", space, key, modelType);
                switch (modelType) {
                    case 'String':
                        return "hello world";
                    case 'Integer':
                        return 200;
                    case 'List':
                        let list = [];
                        if (genericType.indexOf('<') === -1) {
                            let subData = this.generateDataByModel(key, genericType, null, deep);
                            list.push(subData);
                            list.push(subData);
                        } else {
                            curType = genericType.split('<')[0];
                            tplType = genericType.match(/<(.*)>/)[1];
                            let subData = this.generateDataByModel(key, curType, tplType, deep);
                            list.push(subData);
                        }
                        return list;
                    case 'Float':
                        return 10.43;
                    case 'Double':
                        return 11.11;
                    case 'Boolean':
                        return true;
                    case 'Object':
                        curType = genericType.split('<')[0];
                        tplType = genericType.match(/<(.*)>/)[1];
                        ++deep;
                        return this.generateDataByModel(key, curType, tplType, deep);
                }
            } else {
                console.log("%s%s \t%s", space, key, modelType);
                if (!!this.models[modelType]) { // 自定义类型解析
                    let modelDef = JSON.parse(JSON.stringify(this.models[modelType]));
                    ++deep;
                    let mockData = {};
                    for (let key in modelDef) {
                        mockData[key] = this.generateDataByModel(key, modelDef[key], genericType, deep);
                    }

                    return mockData;
                } else {
                    console.log("[%] not found", modelType);
                    return null;
                }
            }
        } else {
            curType = modelType.split('<')[0];
            tplType = modelType.match(/<(.*)>/)[1];
            // console.log("%s%s \t%s \t%s", space, key, curType, tplType);
            return this.generateDataByModel(key, curType, tplType, ++deep);
        }

    }


    generateMockDataByModel(model) {

        let isBaseType = this.BaseDataType.find((element) => {
            return element === model;
        });

        let hasGeneric = model.indexOf('<') !== -1;
        let isDefModel = !!this.models[model];

        if (isBaseType) {
            let mockData;
            switch (model) {
                case 'String':
                    mockData = "hello world";
                    break;
                case 'Integer':
                    mockData = 200;
                    break;
                case 'Float':
                    mockData = 10.43;
                    break;
                case 'Double':
                    mockData = 11.11;
                    break;
                case 'Boolean':
                    mockData = true;
                    break;
                default:
                    break;
            }

            return mockData;
        }

        if (isDefModel) {
            let modelDef = this.models[model];
            let mockData = {};
            for (let key in modelDef) {
                mockData[key] = this.generateMockDataByModel(modelDef[key]);
            }
            return mockData;
        }


        if (hasGeneric) {
            let curType = model.split('<')[0];
            let tplType = model.match(/<(.*)>/)[1];

            if (curType === "List") {
                let arr = [];
                arr.push(this.generateMockDataByModel(tplType));
                return arr;
            } else {
                let mockData = this.generateMockDataByModel(curType);
                let modelDef = this.models[curType];
                let key;
                for (key in modelDef) {
                    if (modelDef[key] === 'Object') {
                        break;
                    }
                }
                mockData[key] = this.generateMockDataByModel(tplType);
                return mockData;
            }
        }
    }
}

module.exports = ModelFactory;
