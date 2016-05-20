"use strict";

class Symbol {
    constructor(name, location) {
        this.name = name;
        this.location = location;
    }

    toString() {
        return this.name;
    }
}

class Variable extends Symbol {
    constructor(name, location) {
        super(name, location);
    }

    getSymbol() {
      return "Variable";
    }
}

class Constant extends Symbol {
    constructor(name, value, location) {
        super(name, location);
        this.value = value;
    }

    getSymbol() {
      return {
        type: "Constant",
        value: this.value
      };
    }
}

class Function extends Symbol {
    constructor(name, params, location) {
        super(name, location);
        this.params = params;
    }

    getSymbol() {
      return {
        type: "Function",
        paramNum: this.getParamsNum()
      };
    }

    getParamsNum() {
      return this.params.length;
    }
}
module.exports.Variable = Variable;
module.exports.Constant = Constant;
module.exports.Function = Function;
