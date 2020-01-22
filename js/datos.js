/* Función para generar todos los datos de una meta */
export async function gen_datos(meta) {
    /* div generico de ajustes */
    let div = document.createElement("div");

    /* div grid */
    let grid = document.createElement("div");
    grid.setAttribute("class", "mdl-grid");
    meta = meta.dataset;

    /* Generación de elementos por cada dato */
    Object.keys(meta).forEach(function(key) {
        carta(grid, key, meta[key]);
    });

    meta = meta.metas.default;

    Object.keys(meta).forEach(function(key) {
        carta(grid, key, meta[key]);
    });

    /* inyeción al div general */
    div.appendChild(grid);
    return div;
}

/* Funcion para generar una carta con un dato */
export async function carta(grid, titulo, dato){
    /* Comprobación que el dato no este vacio */
    if(dato === "undefined" || dato === "null" || dato === undefined || dato === null || dato === ""){
        return;
    }

    /* Comprobación que el dato no sea un objeto */
    if(typeof dato === "object"){
        return;
    }

    /* Comprobación y generación de un dato fecha */
    if(!isNaN(Date.parse(dato))){
        let options = { year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute: 'numeric'};
        let fecha = new Date(dato);
        dato = fecha.toLocaleString("es-ES", options);
    }

    /* Div del dato */
    let div = document.createElement("div");
    div.setAttribute("class", "mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--4-col-phone carta");
    
    /* Titulo del dato */
    let titulo_carta = document.createElement("div");
    titulo_carta.setAttribute("class", "titulo_carta");
    titulo_carta.innerText = titulo;
    div.appendChild(titulo_carta);

    /* Dato */
    let dato_carta = document.createElement("div");
    dato_carta.setAttribute("class", "dato_carta");
    dato_carta.innerHTML = dato;
    div.appendChild(dato_carta);

    /* inyeción al grid */
    grid.appendChild(div);
}