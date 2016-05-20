(() => {
    var semanticErrors = "";
    var semantic = (tree) => {
        var emptySymbolTable = {};
        eachBlockPre(tree, makeTable, emptySymbolTable);
        if (semanticErrors.length > 0) {
            tree.errors = semanticErrors.substring(0, semanticErrors.length - 10);
            semanticErrors = "";
        }
    };

    var eachBlockPre = (tree, action, f) => {
        action(tree, f);
        tree.functions.forEach((func) => eachBlockPre(func, action, tree.symbolTable));
    };

    var makeTable = (block, fatherTable) => {
        block.symbolTable = {
            father: fatherTable
        };
        block.variables.forEach((variable) => add(variable, block.symbolTable));
        block.constants.forEach((constant) => add(constant, block.symbolTable));
        block.functions.forEach((func) => add(func, block.symbolTable));
    };

    var add = (sym, table) => {
        if (checkRedecl(sym, table)) {
            if (parseInt(sym.location.end.line) - parseInt(sym.location.start.line) == 1) {
                semanticErrors += "Semantic Error: " + sym + " has already been declared in line " + sym.location.start.line + "&#13;&#10;";
            } else {
                semanticErrors += "Semantic Error: " + sym + " has already been declared between lines " +
                    sym.location.start.line + " and " + (parseInt(sym.location.end.line) - 1) + "&#13;&#10;";
            }
        }
        table[sym.name] = sym.getSymbol();
    };

    var checkRedecl = (sym, table) => {
        var auxTable = table;
        do {
            if (auxTable[sym.name])
                return true;
            auxTable = auxTable.father;
        } while (auxTable && (sym.getSymbol() != "Variable"));
        return false;
    }

    module.exports = semantic;
})();
