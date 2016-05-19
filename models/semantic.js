(() => {
    var semantic = (tree) => {
        var emptySymbolTable = {};
        eachBlockPre(tree, makeTable, emptySymbolTable);
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
        if (checkRedecl(sym.name, table))
            console.error("Error: " + sym + " ya ha sido declarado.");
        table[sym.name] = sym.getSymbol();
    };

    var checkRedecl = (sym, table) => {
        var auxTable = table;
        while (auxTable) {
            if (auxTable[sym])
                return true;
            auxTable = auxTable.father;
        }
        return false;
    }

    module.exports = semantic;
})();
