// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
    "use strict"; // Use ECMAScript 5 strict mode in browsers that support it
    
    var editor;
    
    $(document).ready(() => {
        editor = ace.edit("original");
        editor.setTheme("ace/theme/sqlserver");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setShowPrintMargin(false);
        editor.session.setUseWorker(false);
    })
    
    /* Volcar la tabla con el resultado en el HTML */
    const fill = (data) => {
        $("#final").get(0).className = "output";
        $("#final").html(JSON.stringify(data.tree, null, 3));
    };

    const handleFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.target.files;

        var reader = new FileReader();
        reader.onload = (e) => {

            editor.setValue(e.target.result, 1);
        };
        reader.readAsText(files[0])
    }

    /* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
    const handleDragFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.

        var reader = new FileReader();
        reader.onload = (e) => {

            editor.setValue(e.target.result, 1);
            evt.target.style.background = "white";
        };
        reader.readAsText(files[0])
    }

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.target.style.background = "yellow";
    }

    $(document).ready(() => {
        let original = document.getElementById("original");
        if (window.localStorage && localStorage.original) {
            editor.setValue(localStorage.original, 1);
        }

        /* Request AJAX para que se calcule la tabla */
        $("#parse").click(() => {
            if (window.localStorage) localStorage.original = editor.getValue();
            $.get("/pl0", /* Request AJAX para que se calcule la tabla */ {
                    input: editor.getValue()
                },
                fill,
                'json'
            );
        });
        /* botones para rellenar el textarea */
        $('button.example').each((_, y) => {
            $(y).click(() => {
                /* Buscamos la entrada de la BD especificada por el nombre del botón
                    y colocamos el contenido de dicha entrada de la BD en el textarea*/
                $.get("/findByName", {
                        name: $(y).text()
                    },
                    (data) => {
                        editor.setValue(data[0].content, 1);
                    });
            });
        });

        /*Buscamos las entradas guardadas en la BD para mostrar los botones
          correspondientes con su nombre asociado*/
        $.get("/find", {}, (data) => {
            for (var i = 0; i < 6; i++) {
                if (data[i]) {
                    $('button.example').get(i).className = "example";
                    $('button.example').get(i).textContent = data[i].name;
                }
            }
        });

        /*Guardamos una nueva entrada en la BD, con el nombre especificado
          por el usuario.*/
        $("#guardar").click(() => {
            if (window.localStorage) localStorage.original = editor.getValue();
            $.get("/mongo/" + $("#titulo").val(), {
                content: editor.getValue()
            });
        });

        // Setup the drag and drop listeners.
        //var dropZone = document.getElementsByClassName('drop_zone')[0];
        let dropZone = $('.drop_zone')[0];
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleDragFileSelect, false);
        let inputFile = $('.inputfile')[0];
        inputFile.addEventListener('change', handleFileSelect, false);
    });
})();
