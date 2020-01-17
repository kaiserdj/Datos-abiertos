import {set_url} from "./url.js";
import {carga_json} from "./carga.js";
import {busqueda_tabla, dato_abierto} from "./tablas.js";

export async function busqueda(search) {
    /* Carga de datos */
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets?search=${search}&rows=10&pretty=false&timezone=UTC&include_app_metas=false`);
    
    /* Dialog de busqueda no encontrada */
    if (Object.keys(datos.datasets).length === 0) {
        let dialog = document.createElement("dialog");
        dialog.setAttribute("class", "mdl-dialog");
        let h4 = document.createElement("h4");
        h4.setAttribute("class", "mdl-dialog__title");
        h4.innerText = "Error";
        dialog.appendChild(h4);
        let div = document.createElement("div");
        div.setAttribute("class", "mdl-dialog__content");
        dialog.appendChild(div);
        let p = document.createElement("p");
        p.innerText = "No se han encontrado elementos";
        div.appendChild(p);
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
        dialog.querySelector('.close').addEventListener('click', function () {
            set_url();
        });
        return;
    }

    /* Carga de tabla */
    let tabla = busqueda_tabla(datos);
    document.getElementsByClassName("mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-cell--4-col-phone table")[0].appendChild(tabla);
    componentHandler.upgradeDom();

    /* Input busqueda */
    var lupa = document.getElementById('lupa');
    lupa.addEventListener('click', function (e) {
        set_url([["tipo", "busqueda"],["valor", search.value]]);
    });
    var search = document.getElementById('busqueda');
    search.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            set_url([["tipo", "busqueda"],["valor", search.value]]);
        }
    });

    var titulo = document.getElementsByClassName("titulo");
    for(let elem of titulo){
        elem.addEventListener('click', function (e) {
            set_url();
        });
    }
}

export async function datos(id) {
    console.log(id);

    /* Carga de datos */
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets/${id}/exports/json?rows=-1&pretty=false&timezone=UTC`);
    

    dato_abierto(datos);
}