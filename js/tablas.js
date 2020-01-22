import {carga_json} from "./carga.js";
import {set_url} from "./url.js";
import {detectar_enlace} from "./utils.js";

/* Funcion para generar la tabla de busqueda de datos abiertos */
export function busqueda_tabla(datos) {
    /* Creación elemento tabla */
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-shadow--2dp table sortable draggable");
    let thead = table.createTHead();

    /* Titulos de la tabla*/
    let row = thead.insertRow();

    row.insertCell().outerHTML = `<th>Titulo</th>`;
    row.insertCell().outerHTML = `<th>Tema</th>`;
    row.insertCell().outerHTML = `<th>Registros</th>`;
    row.insertCell().outerHTML = `<th></th>`;

    /* Datos de la tabla */
    let tbody = table.createTBody();
    datos.datasets.forEach(dato => {
        let id = dato.dataset.dataset_id;
        let fila = tbody.insertRow();

        /* Titulo de Dato */
        let titulo = fila.insertCell();
        titulo.innerText = `${dato.dataset.metas.default.title}`;
        titulo.setAttribute("class", "mdl-data-table__cell--non-numeric");

        /* Tema del Dato */
        let tema = fila.insertCell();
        if (dato.dataset.metas.default.theme !== null) {
            tema.innerText = `${dato.dataset.metas.default.theme.toString()}`;
        }
        tema.setAttribute("class", "mdl-data-table__cell--non-numeric");

        /* Numero de registros del Dato */
        let registros = fila.insertCell();
        registros.innerText = `${dato.dataset.metas.default.records_count}`;

        /* Boton carga */
        let boton_td = fila.insertCell();
        let btn = document.createElement('input');
        btn.type = "button";
        btn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
        btn.value = "cargar";
        btn.onclick = (function (id) {
            return function () {
                set_url([
                    ["tipo", "dato"],
                    ["valor", id]
                ]);
            }
        })(id);
        boton_td.appendChild(btn);
    });

    return table;
}

/* Funcion para generar la tabla de datos abiertos */
export async function dato_abierto(meta, datos) {
    /* Creación elemento tabla */
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-shadow--2dp table sortable draggable");
    let thead = table.createTHead();
    let row = thead.insertRow();

    /* Titulos de la tabla*/
    for (let titulo of Object.keys(datos[0])) {
        row.insertCell().outerHTML = `<th>${meta.fields.find(elem => elem.name === titulo).label.es}</th>`;
    }

    let tbody = table.createTBody();

    /* Datos de la tabla */
    for (let dato of datos) {
        let elementos = Object.keys(dato);
        let fila = tbody.insertRow();
        for (let elem of elementos) {
            let celda = fila.insertCell();
            let type = meta.fields.find(search => search.name === elem).type;

            /* Tipos de posibles datos */
            switch (type) {
                case "int":
                case "double":
                    celda.innerText = dato[elem];
                    break;

                case "geo_point_2d":
                case "geo_shape":
                    let btn = document.createElement('input');
                    btn.type = "button";
                    btn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
                    btn.value = "cargar";
                    btn.onclick = (function (meta, data) {
                        return function () {
                            if(type === "geo_point_2d"){
                                geo_point_2d(meta, data);
                            }else{
                                geo_shape(data);
                            }
                        }
                    })(meta.fields.find(search => search.name === elem), dato[elem]);
                    celda.appendChild(btn);
                    break;

                default:
                    celda.setAttribute("class", "mdl-data-table__cell--non-numeric");
                    if (typeof dato[elem] === "string") {
                        if (dato[elem].search("href") === -1  && dato[elem].search("src") === -1) {
                            celda.innerHTML = await detectar_enlace(dato[elem]);
                        } else {
                            celda.innerHTML = dato[elem];
                        }
                    } else {
                        celda.innerText = dato[elem];
                    }
                    break;
            }

        }
    }

    return table;
}

export async function geo_shape(datos) {
    /* Mostrar datos tratados en consola */
    console.clear();
    const style = [
        'background: #000',
        'color: #fff',
        'padding: 10px 20px',
        'line-height: 35px'
        ].join(';');
    console.info('%c Si desea copiarlo', style);
    console.log(JSON.stringify(datos.geometry.coordinates));
    console.log('%c Si desea ver los elementos', style);
    console.info(datos.geometry.coordinates);

    /* Creación de dialg */
    let dialog = document.createElement("dialog");
    dialog.setAttribute("class", "mdl-dialog");

    /* Titulo dialog */
    let h4 = document.createElement("h4");
    h4.setAttribute("class", "mdl-dialog__title");
    h4.innerText = "Abre la consola(inspector de elementos)";
    dialog.appendChild(h4);

    /* Boton dialog */
    let div = document.createElement("div");
    div.setAttribute("class", "mdl-dialog__actions");
    dialog.appendChild(div);
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "mdl-button close");
    button.innerText = "Cerrar";
    div.appendChild(button);

    /* inyeción dialog */
    dialog.appendChild(div);
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(dialog);
    dialog.showModal();

    /* Funcion dialog */
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.remove();
    });
}

export async function geo_point_2d(meta, datos) {
    /* Mostrar datos tratados en consola */
    console.log(
        '%c geo_point_2d',
        'font-size: 20px; background-color: yellow; color:red; margin-left: 20px;'
      );
    console.log(meta);
    console.log(datos);

    /* dialog */
    let dialog = document.createElement("dialog");
    dialog.setAttribute("class", "mdl-dialog");

    /* titulo */
    let h4 = document.createElement("h4");
    h4.setAttribute("class", "mdl-dialog__title");
    h4.innerText = meta.label.es;
    dialog.appendChild(h4);

    /* contenido */
    let div = document.createElement("div");
    div.setAttribute("class", "mdl-dialog__content");
    dialog.appendChild(div);
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "mdl-data-table mdl-data-table--selectable mdl-js-data-table mdl-shadow--2dp table sortable draggable");
    let thead = table.createTHead();
    let row = thead.insertRow();

    for (let titulo of Object.keys(datos)) {
        row.insertCell().outerHTML = `<th>${titulo}</th>`;
    }

    let tbody = table.createTBody();
    let fila = tbody.insertRow();

    for (let elem of Object.keys(datos)) {
        let celda = fila.insertCell();
        celda.innerText = datos[elem];
    }

    div.appendChild(table);

    /* Boton */
    let div2 = document.createElement("div");
    div2.setAttribute("class", "mdl-dialog__actions");
    dialog.appendChild(div2);
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "mdl-button close");
    button.innerText = "Cerrar";
    div2.appendChild(button);

    dialog.appendChild(div);

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(dialog);
    dialog.showModal();

    /* Evento */
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.remove();
    });
}


export async function aju_tabla(apend, meta, div_id, id) {
    /* div generico de ajustes */
    let aju = document.createElement("div");
    aju.setAttribute("class", "aju");
    apend.appendChild(aju);

    /* Selector*/
    let aju_chip = document.createElement("span");
    aju_chip.setAttribute("class", "mdl-chip");
    aju.appendChild(aju_chip);
    let aju_text = document.createElement("span");
    aju_text.setAttribute("class", "mdl-chip__text");
    aju_text.innerText = "Numero de elementos:";
    aju_chip.appendChild(aju_text);
    let aju_divsel = document.createElement("div");
    aju_divsel.setAttribute("class", "select");
    aju.appendChild(aju_divsel);
    let aju_select = document.createElement("select");
    aju_select.setAttribute("name", "rows");
    aju_select.setAttribute("id", "rows");
    aju_divsel.appendChild(aju_select);
    let aju_10 = document.createElement("option");
    if(meta.dataset.metas.default.records_count > 10){
        aju_10.setAttribute("value", "10");
        aju_10.innerText = "10";
        aju_select.appendChild(aju_10);
        
    }
    let aju_20 = document.createElement("option");
    if(meta.dataset.metas.default.records_count > 20){
        aju_20.setAttribute("value", "20");
        aju_20.innerText = "20";
        aju_select.appendChild(aju_20);
    }
    let aju_100 = document.createElement("option");
    if(meta.dataset.metas.default.records_count > 100){
        aju_100.setAttribute("value", "100");
        aju_100.innerText = "100";
        aju_select.appendChild(aju_100);
    }

    let aju_0 = document.createElement("option");
    aju_0.setAttribute("value", "-1");
    aju_0.innerText = "Todo";
    aju_select.appendChild(aju_0);

    /* Paginación */
    let aju_chip2 = document.createElement("span");
    aju_chip2.setAttribute("class", "mdl-chip");
    aju.appendChild(aju_chip2);
    let aju_text2 = document.createElement("span");
    aju_text2.setAttribute("class", "mdl-chip__text");
    aju_text2.innerText = "Paginación:";
    aju_chip2.appendChild(aju_text2);
    let aju_chip3 = document.createElement("span");
    aju_chip3.setAttribute("class", "mdl-chip");
    aju.appendChild(aju_chip3);
    let  div_pag = document.createElement("div");
    div_pag.setAttribute("class", "pagination");
    aju_chip3.appendChild(div_pag);

    /* Generar paginación */
    recargar_nav(meta, div_pag, div_id, id);

    /* Evento deteción de selector de numero de elementos */
    document.getElementById('rows').addEventListener('change', function() {
        window.rows = this.value;
        window.offset = 0;
        recargar_tabla(meta, div_id, id);
        recargar_nav(meta, div_pag, div_id, id);
    });
}

/* Funcion para recargar la tabla */
export async function recargar_tabla(meta, select, id) {
    /* Limpiar tabla */
    let tbl = document.getElementsByTagName("table")[0];
    if(tbl) tbl.parentNode.removeChild(tbl);

    /* Cargar nuevos datos*/
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets/${id}/exports/json?rows=${rows}&start=${offset}&pretty=false&timezone=UTC`);
    
    /* Console log de datos */
    console.clear();
    console.log(
        '%c Datos tratados',
        'font-size: 20px; background-color: yellow; color:red; margin-left: 20px;'
      );
    console.log(meta);
    console.log(datos);

    /* Crear tabla */
    let tabla = await dato_abierto(meta.dataset, datos);
    
    /* Inyectar tabla */
    document.getElementById(select).appendChild(tabla);
    await dragtable();
}

/* Funcion para generar paginación */
export async function recargar_nav(meta, div_pag, div_id, id) {
    /* Limpieza */
    document.getElementsByClassName("pagination")[0].innerHTML = "";

    /* Creacion de limites */
    let num_pag;
    let lim_pag;
    let lim_meta = meta.dataset.metas.default.records_count;
    if((offset/rows) < 2){
        num_pag = 0;
    }else{
        num_pag = (offset/rows) - 2;
    }
    if((lim_meta/rows)<5){
        lim_pag = lim_meta/rows;
    }else{
        if((lim_meta/rows) > (num_pag + 7)){
            lim_pag = num_pag + 7;
        }else{
            lim_pag = lim_meta/rows;
        } 
    }

    /* primer pagina */
    if(num_pag!==0 && rows !== -1){
        let span0 = document.createElement("span");
        span0.innerText = 1;
        span0.setAttribute("class", "nav_boton");
        div_pag.appendChild(span0);
        let puntos = document.createElement("a");
        puntos.innerText = "...";
        div_pag.appendChild(puntos);
    }

    /* paginacion */
    for(;num_pag<lim_pag;num_pag++){
        let span = document.createElement("span");
        span.innerText = Math.trunc(num_pag)+1;
        span.setAttribute("class", "nav_boton");
        if(num_pag===(offset/rows)){
            span.setAttribute("active", "");
        }
        div_pag.appendChild(span);
    }

    /*ultima pagina*/
    if((num_pag) < (lim_meta/rows)){
        let puntos2 = document.createElement("a");
        puntos2.innerText = "...";
        div_pag.appendChild(puntos2);
        let span_ult = document.createElement("span");
        span_ult.innerText = Math.trunc(lim_meta/rows);
        span_ult.setAttribute("class", "nav_boton");
        div_pag.appendChild(span_ult);
    }

    /* eventos */
    for (let i = 0; i < document.getElementsByClassName('nav_boton').length; i++) {
        document.getElementsByClassName('nav_boton')[i].addEventListener('click', function() {
            for(let i = 0; i < document.getElementsByClassName('nav_boton').length; i++){
                document.getElementsByClassName('nav_boton')[i].removeAttribute("active");
            }
            this.setAttribute("active", "");
            offset = (this.innerText-1) * rows;
            recargar_tabla(meta, div_id, id);
            recargar_nav(meta, div_pag, div_id, id);
        });
    }
}

export async function dragtable() {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'js/dragtable.js';
    head.appendChild(script);
}