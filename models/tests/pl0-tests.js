/*require('blanket')({
    pattern: ["../*.js"]
  
    function (filename) {
        return !/node_modules/.test(filename);
    }
});*/

/*var blanket = require("blanket")({
   "pattern": "../pl0node.js"
   });*/

var expect = require('chai').expect;
const PEG = require("../pl0node.js");
const semantic = require("../semantic.js");

describe("pl0node", function() {

  describe("pl0", function() {
    it("Debería aceptar una declaración de una constante 'A' igual a 3", function() {
      var tree = PEG.parse("const A = 3;{}");
      expect(tree.type).to.be.equal("BLOCK");
      expect(tree.constants[0].name).to.be.equal("A");
      expect(tree.constants[0].value).to.be.equal(3);
      expect(tree.constants[0].location.start.line).to.be.equal(1);
    });
    
    it("Debería aceptar una declaración de una variable 'a'", function() {
      var tree = PEG.parse("const A = 3;\nvar a;{}");
      expect(tree.type).to.be.equal("BLOCK");
      expect(tree.variables[0].name).to.be.equal("a");
      expect(tree.variables[0].location.start.line).to.be.equal(2);
    });
    
    it("Debería aceptar una declaración de una funcion 'uno'", function() {
      var tree = PEG.parse("const A = 4, B = 30;\nvar b, n;\nfunction uno();\nreturn 1;{}");
      expect(tree.type).to.be.equal("BLOCK");
      expect(tree.functions[0].name).to.be.equal("uno");
      expect(tree.functions[0].location.start.line).to.be.equal(3);
      expect(tree.functions[0].params.length).to.be.equal(0);
      expect(tree.functions[0].type).to.be.equal("BLOCK");
      expect(tree.functions[0].constants.length).to.be.equal(0);
      expect(tree.functions[0].variables.length).to.be.equal(0);
      expect(tree.functions[0].functions.length).to.be.equal(0);
    });
    
    it("Debería aceptar una declaración de una funcion 'dos' con una constante y dos variables", function() {
      var tree = PEG.parse("const A = 4, B = 30;\nvar b, n;\nfunction uno();\nconst DOS = 2;\nvar a,b;\nreturn DOS;{}");
      expect(tree.type).to.be.equal("BLOCK");
      expect(tree.functions[0].name).to.be.equal("uno");
      expect(tree.functions[0].location.start.line).to.be.equal(3);
      expect(tree.functions[0].params.length).to.be.equal(0);
      expect(tree.functions[0].type).to.be.equal("BLOCK");
      expect(tree.functions[0].constants.length).to.be.equal(1);
      expect(tree.functions[0].variables.length).to.be.equal(2);
      expect(tree.functions[0].functions.length).to.be.equal(0);
    });
    
    it("No debería aceptar una inicialización de una variable", function() {
      try {
        var tree = PEG.parse("const A = 4, B = 30;\nvar b, n = 3;{}");
      } catch(e) {
        expect(e.message).to.be.equal('Expected ",", ";" or [ \\t\\n\\r] but "=" found.');
      }
    });
    
    it("Debería completarse la symbolTable de forma correcta", function() {
      var tree = PEG.parse("const A = 4, B = 30;\nvar b, n;\nfunction uno();\nconst DOS = 2;\nvar a,b;\nreturn DOS;{}");
      semantic(tree);
      expect(tree.type).to.be.equal("BLOCK");
      //Symbol Table propia
      expect(tree.functions[0].symbolTable["a"]).to.be.equal("Variable");
      expect(tree.functions[0].symbolTable["b"]).to.be.equal("Variable");
      expect(tree.functions[0].symbolTable["DOS"].type).to.be.equal("Constant");
      expect(tree.functions[0].symbolTable["DOS"].value).to.be.equal(2);
      // Symbol Table del padre
      expect(tree.functions[0].symbolTable.father["b"]).to.be.equal("Variable");
      expect(tree.functions[0].symbolTable.father["n"]).to.be.equal("Variable");
      expect(tree.functions[0].symbolTable.father["A"].type).to.be.equal("Constant");
      expect(tree.functions[0].symbolTable.father["A"].value).to.be.equal(4);
      expect(tree.functions[0].symbolTable.father["B"].type).to.be.equal("Constant");
      expect(tree.functions[0].symbolTable.father["B"].value).to.be.equal(30);
      expect(tree.functions[0].symbolTable.father["uno"].type).to.be.equal("Function");
      expect(tree.functions[0].symbolTable.father["uno"].paramNum).to.be.equal(0);
      // Symbol Table del padre del padre
      expect(tree.functions[0].symbolTable.father.father.length).to.be.empty;
    });
    
     it("Debería detectar un error semántico de redeclaración de constantes", function() {
      var tree = PEG.parse("const A = 4,\nA = 30;{}");
      semantic(tree);
      expect(tree.errors).to.be.equal("Semantic Errors:&#13;&#10;'A' has already been declared in line 1");
    });
    
    it("Debería detectar un error semántico de redeclaración de variables", function() {
      var tree = PEG.parse("const A = 4;\nvar a,a;{}");
      semantic(tree);
      expect(tree.errors).to.be.equal("Semantic Errors:&#13;&#10;'a' has already been declared in line 2");
    });
    
    it("Debería detectar un error semántico de redeclaración de funciones", function() {
      var tree = PEG.parse("const A = 4;\nfunction fact();\nfunction fact();{};{};{}");
      semantic(tree);
      expect(tree.errors).to.be.equal("Semantic Errors:&#13;&#10;'fact' has already been declared in line 3");
    });
    
     it("Debería detectar un error semántico de número erróneo de parámetros", function() {
      var tree = PEG.parse("var b, n;\nfunction fact(n);{};\n{b = fact(n, 3);}");
      semantic(tree);
      expect(tree.errors).to.be.equal("Semantic Errors:&#13;&#10;'fact' has 2 parameters instead of 1 in line 3");
    });
    
    it("Debería detectar un error semántico de llamada a función no existente", function() {
      var tree = PEG.parse("var b, n;\nfunction fact(n);{};\n{b = raiz(n);}");
      semantic(tree);
      expect(tree.errors).to.be.equal("Semantic Errors:&#13;&#10;'raiz' has not been declared in line 3");
    });
    
    it("Debería detectar un error semántico de uso de una variable no existente", function() {
      var tree = PEG.parse("var b, n;\nfunction fact(n);{};\n{b = fact(z);}");
      semantic(tree);
      expect(tree.errors).to.be.equal("Semantic Errors:&#13;&#10;'z' has not been declared in line 3");
    });
  });
});

