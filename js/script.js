import {carga_json} from "./carga.js";
import {busqueda} from "./tablas.js";

async function carga_tabla_busqueda(search){
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets?search=${search}&rows=10&pretty=false&timezone=UTC&include_app_metas=false`);
    if(Object.keys(datos.datasets).length===0){
        let dialog= document.createElement("dialog");
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
        dialog.querySelector('.close').addEventListener('click', function() {
            dialog.close();
          });
        return;
    }
    if(document.getElementsByTagName("table").length > 0){
        var tbl = document.getElementsByTagName("table")[0];
        if(tbl) tbl.parentNode.removeChild(tbl);
    }
    let tabla = busqueda(datos);
    document.getElementsByClassName("mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-cell--4-col-phone table")[0].appendChild(tabla);
    componentHandler.upgradeDom();
}

async function main() {
    await carga_tabla_busqueda("");
}

var lupa = document.getElementById('lupa');
lupa.addEventListener('click', function (e) {
    carga_tabla_busqueda(search.value);  
});
var search = document.getElementById('busqueda');
search.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
       carga_tabla_busqueda(search.value);  
    }
});

main();