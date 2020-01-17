import {set_url} from "./url.js";
import {detectar_enlace} from "./utils.js";

export function busqueda_tabla(datos) {
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-shadow--2dp table sortable draggable");
    let thead = table.createTHead();
    let row = thead.insertRow();

    row.insertCell().outerHTML = `<th>Titulo</th>`;
    row.insertCell().outerHTML = `<th>Tema</th>`;
    row.insertCell().outerHTML = `<th>Registros</th>`;
    row.insertCell().outerHTML = `<th></th>`;


    let tbody = table.createTBody();
    datos.datasets.forEach(dato => {
        console.log(dato);
        let id = dato.dataset.dataset_id;
        let fila = tbody.insertRow();
        let titulo = fila.insertCell();
        titulo.innerText = `${dato.dataset.metas.default.title}`;
        titulo.setAttribute("class", "mdl-data-table__cell--non-numeric");
        let tema = fila.insertCell();
        if(dato.dataset.metas.default.theme !== null){
            tema.innerText = `${dato.dataset.metas.default.theme.toString()}`;
        }        
        tema.setAttribute("class", "mdl-data-table__cell--non-numeric");
        let registros = fila.insertCell();
        registros.innerText = `${dato.dataset.metas.default.records_count}`;

        let boton_td = fila.insertCell();
        let btn = document.createElement('input');
        btn.type = "button";
        btn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
        btn.value = "cargar";
        btn.onclick = (function (id) {
            return function () {
                set_url([["tipo", "dato"],["valor", id]]);
            }
        })(id);
        boton_td.appendChild(btn);
    });

    return table;
}

export async function dato_abierto(meta, datos) {
    console.log(meta);
    console.log(datos);
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "mdl-data-table mdl-data-table--selectable mdl-js-data-table mdl-shadow--2dp table sortable draggable");
    let thead = table.createTHead();
    let row = thead.insertRow();

    for(let titulo of Object.keys(datos[0])){
        row.insertCell().outerHTML = `<th>${meta.fields.find(elem => elem.name === titulo).label.es}</th>`;
    }

    let tbody = table.createTBody();

    for(let dato of datos){
        let elementos = Object.keys(dato);
        let fila = tbody.insertRow();
        for(let elem of elementos){
            if(typeof dato[elem] === "string"){
                if(dato[elem].search("href") === -1){
                    fila.insertCell().innerHTML = await detectar_enlace(dato[elem]);
                }else{
                    fila.insertCell().innerHTML = dato[elem];
                }                
            }else{
                fila.insertCell().innerText = dato[elem];
            }
        }
    }

    return table;
}