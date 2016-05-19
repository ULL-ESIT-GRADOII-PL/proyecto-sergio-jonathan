"use strict";

class Symbol {
    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

class Variable extends Symbol {
    constructor(name) {
        super(name);
    }

    getSymbol() {
      return "Variable";
    }
}

class Constant extends Symbol {
    constructor(name, value) {
        super(name);
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
    constructor(name, params, body) {
        super(name);
        this.params = params;
        this.body = body;
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
