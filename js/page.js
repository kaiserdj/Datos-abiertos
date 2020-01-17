import {set_url} from "./url.js";
import {carga_json} from "./carga.js";
import {busqueda_tabla, dato_abierto} from "./tablas.js";

export function base() {
    /* div base */
    let layout = document.createElement("div");
    layout.setAttribute('class', "demo-layout-transparent mdl-layout mdl-js-layout mdl-layout--no-desktop-drawer-button");

    /* header */
    let header = document.createElement("header");
    header.setAttribute('class', "mdl-layout__header mdl-layout__header--transparent");
    layout.appendChild(header);
    let div_header = document.createElement("div");
    div_header.setAttribute('class', "mdl-layout__header-row");
    header.appendChild(div_header);
    let titulo = document.createElement("span");
    titulo.setAttribute("class", "mdl-layout-title titulo");
    titulo.innerText = "Datos abiertos";
    div_header.appendChild(titulo);
    let separador = document.createElement("div");
    separador.setAttribute("class", "mdl-layout-spacer");
    div_header.appendChild(separador);
    let nav = document.createElement("div");
    nav.setAttribute("class", "mdl-navigation");
    div_header.appendChild(nav);
    let link = document.createElement("a");
    link.setAttribute("class", "mdl-navigation__link");
    link.setAttribute("href", "https://analisis.datosabiertos.jcyl.es/");
    link.innerText = "Junta";
    nav.appendChild(link);

    /* div movil */
    let movil = document.createElement("div");
    movil.setAttribute("class", "mdl-layout__drawer");
    layout.appendChild(movil);
    let titulo_movil = document.createElement("span");
    titulo_movil.setAttribute("class", "mdl-layout-title titulo");
    titulo_movil.innerText = "Datos abiertos";
    movil.appendChild(titulo);
    let nav_movil = document.createElement("div");
    nav_movil.setAttribute("class", "mdl-navigation");
    movil.appendChild(nav);
    let link_movil = document.createElement("a");
    link_movil.setAttribute("class", "mdl-navigation__link");
    link_movil.setAttribute("href", "https://analisis.datosabiertos.jcyl.es/");
    link_movil.innerText = "Junta";
    nav_movil.appendChild(link_movil);


    /* main */
    let main = document.createElement("main");
    main.setAttribute("class", "mdl-layout__content");
    layout.appendChild(main);

    /* footer */
    let footer = document.createElement("footer");
    footer.setAttribute("class", "mdl-mini-footer");
    layout.appendChild(footer);
    let div_footer = document.createElement("div");
    div_footer.setAttribute("class" , "mdl-mini-footer__left-section");
    footer.appendChild(div_footer);
    let logo = document.createElement("div");
    logo.setAttribute("class", "mdl-logo");
    logo.innerText = "Datos abiertos";
    div_footer.appendChild(logo);
    let ul = document.createElement("ul");
    ul.setAttribute("class", "mdl-mini-footer__link-list");
    div_footer.appendChild(ul);
    let li = document.createElement("li");
    li.innerText = "Hecho por Francisco Jesús";
    ul.appendChild(li);


    /* inyeción */
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(layout);
    componentHandler.upgradeDom();
}

export async function busqueda(busqueda) {
    /* grid */
    let grid = document.createElement("div");
    grid.setAttribute("class", "mdl-grid");
    let main = document.getElementsByTagName("main")[0];
    let grid_3 = document.createElement("div");
    grid_3.setAttribute("class", "mdl-cell mdl-cell--3-col");
    grid.appendChild(grid_3);
    let div_buscar = document.createElement("div");
    div_buscar.setAttribute("class", "mdh-expandable-search");
    grid_3.appendChild(div_buscar);
    let ico_buscar = document.createElement("i");
    ico_buscar.setAttribute("class", "material-icons");
    ico_buscar.setAttribute("id", "lupa");
    ico_buscar.innerText = "search";
    div_buscar.appendChild(ico_buscar);
    let form = document.createElement("form");
    form.setAttribute("action", "#");
    div_buscar.appendChild(form);
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "busqueda");
    input.setAttribute("placeholder", "Buscar");
    input.setAttribute("size", "12");
    input.setAttribute("id", "busqueda");
    div_buscar.appendChild(input);
    let grid_9 = document.createElement("div");
    grid_9.setAttribute("class", "mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-cell--4-col-phone table");
    grid.appendChild(grid_9);   

    main.appendChild(grid);

    /* Carga de datos */
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets?search=${busqueda}&rows=10&pretty=false&timezone=UTC&include_app_metas=false`);
    
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
    var search = document.getElementById('busqueda');
    search.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            set_url([["tipo", "busqueda"],["valor", search.value]]);
        }
    });
    var lupa = document.getElementById('lupa');
    lupa.addEventListener('click', function (e) {
        set_url([["tipo", "busqueda"],["valor", search.value]]);
    });

    var titulo = document.getElementsByClassName("titulo");
    for(let elem of titulo){
        elem.addEventListener('click', function (e) {
            set_url();
        });
    }
}

export async function datos(id) {
    /* Carga de datos */
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets/${id}/exports/json?rows=-1&pretty=false&timezone=UTC`);
    
    let a = document.createElement("div");
    a.innerText = JSON.stringify(datos);
    let main = document.getElementsByTagName("main")[0];
    main.appendChild(a);

    dato_abierto(datos);
    
}