(function() {
    "use strict";
    const util = require('util');
    const mongoose = require('mongoose');

    /*Creamos el esquema de nuestra colección*/
    const InputSchema = mongoose.Schema({
        "name": {
            type: String,
            unique: true
        },
        "content": String
    });

    /*Creamos el modelo de datos Input a partir del esquema ya creado*/
    const Input = mongoose.model("Input", InputSchema);

    /*Creamos los tres ejemplos iniciales*/
    let input1 = new Input({
        "name": "input4.pl0",
        "content": `const A = 4,
              B = 30;
        var b, n;
        function fact(n);
          var t;
          function tutu(a,b,c);
            return 4;
          {
            if n <= 1 then return 1
            else return n*fact(n-1);
          };
        {
          n = 9;
          b = fact(n);
        }`
    });
    let input2 = new Input({
        "name": "input5.pl0",
        "content": `const A = 4,
              B = 30;
        var b, n;

        function fact(n);
          var t;
          function tutu(a,b,c);
            return 4;
        {
          if n <= 1 then return 1
          else return n*fact(n-1);
        };

        function chuchu(x,y);
        const Z = 4;
        var b;
        {
          b = 5;
        };
        {
          n = 9;
          b = fact(n);
        }`
    });
    let input3 = new Input({
        "name": "twicedecl.pl0",
        "content": `const A = 4,
              B = 30,
              A = 6;
        var b, n;
        function fact(n);
          var t;
          function tutu(a,b,c);
            return 4;
          {
            if n <= 1 then return 1
            else return n*fact(n-1);
          };
        {
          n = 9;
          b = fact(n);
        }`

    });

    /*Añadimos los ejemplos a la BD*/
    let promise1 = input1.save(function(err) {
        if (err) {
            console.log(`Hubieron errores:\n${err}`);
            return err;
        }
        console.log(`Guardado: ${input1}`);
    });

    let promise2 = input2.save(function(err) {
        if (err) {
            console.log(`Hubieron errores:\n${err}`);
            return err;
        }
        console.log(`Guardado: ${input2}`);
    });

    let promise3 = input3.save(function(err) {
        if (err) {
            console.log(`Hubieron errores:\n${err}`);
            return err;
        }
        console.log(`Guardado: ${input3}`);
    });

    /*Esperamos a que se creen los ejemplos*/
    Promise.all([promise1, promise2, promise3]).then((value) => {
        console.log("Se han creado las entradas:\n" + util.inspect(value, {
            depth: null
        }));
    }, (reason) => {
        console.log("No se han podido crear las entradas:\n" + reason);
    });

    module.exports = Input;
})();
