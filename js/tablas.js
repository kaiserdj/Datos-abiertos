import {carga_json} from "./carga.js";

export function busqueda(datos) {
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    let thead = table.createTHead();
    let row = thead.insertRow();

    let a = row.insertCell().outerHTML = `<th>Titulo</th>`;
    row.insertCell().outerHTML = `<th>Tema</th>`;
    row.insertCell().outerHTML = `<th>Registros</th>`;
    row.insertCell().outerHTML = `<th></th>`;


    let tbody = table.createTBody();
    datos.datasets.forEach(dato => {
        let id = dato.dataset.dataset_id;
        let fila = tbody.insertRow();
        let titulo = fila.insertCell();
        titulo.innerText = `${dato.dataset.metas.default.title}`;
        titulo.setAttribute("class", "mdl-data-table__cell--non-numeric");
        let tema = fila.insertCell();
        tema.innerText = `${dato.dataset.metas.default.theme.toString()}`;
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
                dato_abierto(id);
            }
        })(id);
        boton_td.appendChild(btn);
    });

    return table;
}

async function dato_abierto(id) {
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets/${id}?pretty=false&timezone=UTC&include_app_metas=false`);

    console.log(datos);    
}
