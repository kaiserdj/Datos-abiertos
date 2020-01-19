import {
    set_url
} from "./url.js";
import {
    detectar_enlace,
    numero
} from "./utils.js";

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
        if (dato.dataset.metas.default.theme !== null) {
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

export async function dato_abierto(meta, datos) {
    console.log(meta);
    console.log(datos);



    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("class", "mdl-data-table mdl-data-table--selectable mdl-js-data-table mdl-shadow--2dp table sortable draggable");
    let thead = table.createTHead();
    let row = thead.insertRow();

    for (let titulo of Object.keys(datos[0])) {
        row.insertCell().outerHTML = `<th>${meta.fields.find(elem => elem.name === titulo).label.es}</th>`;
    }

    let tbody = table.createTBody();

    for (let dato of datos) {
        let elementos = Object.keys(dato);
        let fila = tbody.insertRow();
        for (let elem of elementos) {
            let celda = fila.insertCell();
            switch (meta.fields.find(search => search.name === elem).type) {
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
                            dialog_table(meta, data);
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

export async function dialog_table(meta, datos) {
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