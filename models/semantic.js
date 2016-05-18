(() => {
    var semantic = (tree) => {
        var emptySymbolTable = {};
        eachBlockPre(tree, makeTable, emptySymbolTable);
    };

    var eachBlockPre = (tree, action, f) => {
        //console.log("Father: " + f);
        action(tree, f);
        tree.functions.forEach((func) => eachBlockPre(func, action, tree.symbolTable));
    };

    var makeTable = (block, f) => {
        //console.log(block.name.value);
        block.symbolTable = {
            father: f
        };
        block.variables.forEach((variable) => addSymbol(variable, block.symbolTable));
        block.constants.forEach((constant) => addSymbol(constant, block.symbolTable));
        block.functions.forEach((func) => addSymbol(func.name.value, block.symbolTable));
    };

    var addSymbol = (sym, table) => {
        //console.log("SYM: " + sym);
        if (sym instanceof Array) {
            if (table[sym[0]])
                console.error("Error: " + sym[0] + " ya ha sido declarado.");
            table[sym[0]] = sym[1];
        } else {
            if (table[sym])
                console.error("Error: " + sym + " ya ha sido declarado.");
            table[sym] = 'not defined';
        }
    };

    module.exports = semantic;
})();
