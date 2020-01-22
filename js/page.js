import {set_url} from "./url.js";
import {carga_json} from "./carga.js";
import {gen_datos} from "./datos.js";
import {busqueda_tabla, dato_abierto, aju_tabla, dragtable} from "./tablas.js";
import {carga_mapa} from "./mapa.js";
import {externalLinks, egg} from "./utils.js";


/* Funcion para generar la base de la web */
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
    movil.appendChild(titulo_movil);
    let nav_movil = document.createElement("div");
    nav_movil.setAttribute("class", "mdl-navigation");
    movil.appendChild(nav_movil);
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
    li.setAttribute("id", "egg");
    li.innerText = "Hecho por Francisco Jesús";
    ul.appendChild(li);
    li.addEventListener('click', function() {
        egg();
    });


    /* inyeción */
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(layout);
    componentHandler.upgradeDom();

    /* Event titulo */
    let titulo_elem = document.getElementsByClassName("titulo");
    for(let elem of titulo_elem){
        elem.addEventListener('click', function (e) {
            set_url();
        });
    }
}

/* Elementos para la pagina de busqueda */
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
    
    /* Console log de datos */
    console.log(
        '%c Datos tratados',
        'font-size: 20px; background-color: yellow; color:red; margin-left: 20px;'
      );
    console.log(datos);

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
    await dragtable();
    await externalLinks();

    /* Events Input busqueda */
    let search = document.getElementById('busqueda');
    search.addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            set_url([["tipo", "busqueda"],["valor", search.value]]);
        }
    });
    let lupa = document.getElementById('lupa');
    lupa.addEventListener('click', function (e) {
        set_url([["tipo", "busqueda"],["valor", search.value]]);
    });
}

/* Elementos para la pagina de mostrar datos */
export async function datos(id) {
    window.rows = 10;
    window.offset = 0;

    /* tabs */
    let tabs = document.createElement("div");
    tabs.setAttribute("class", "mdl-tabs mdl-js-tabs mdl-js-ripple-effect");
    let main = document.getElementsByTagName("main")[0];
    main.appendChild(tabs);
    let tab_bar = document.createElement("div");
    tab_bar.setAttribute("class", "mdl-tabs__tab-bar");
    tabs.appendChild(tab_bar);
    let a_datos = document.createElement("a");
    a_datos.setAttribute("href", "#datos");
    a_datos.setAttribute("class", "mdl-tabs__tab");
    a_datos.innerText = "Datos generales";
    tab_bar.appendChild(a_datos);
    let a_tabla = document.createElement("a");
    a_tabla.setAttribute("href", "#tabla");
    a_tabla.setAttribute("class", "mdl-tabs__tab is-active");
    a_tabla.innerText = "Tabla";
    tab_bar.appendChild(a_tabla);
    let a_mapa = document.createElement("a");
    a_mapa.setAttribute("href", "#mapa");
    a_mapa.setAttribute("class", "mdl-tabs__tab none");
    a_mapa.innerText = "Mapa";
    tab_bar.appendChild(a_mapa);

    /* Carga de datos */
    let meta = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets/${id}?pretty=false&timezone=UTC&include_app_metas=false`);
    let datos = await carga_json(`https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets/${id}/exports/json?rows=${rows}&start=${offset}&pretty=false&timezone=UTC`);
    
    /* Console log de datos */
    console.log(
        '%c Datos tratados',
        'font-size: 20px; background-color: yellow; color:red; margin-left: 20px;'
      );
    console.log(meta);
    console.log(datos);

    /* Datos generales */
    let tab_datos = document.createElement("div");
    tab_datos.setAttribute("class", "mdl-tabs__panel");
    tab_datos.setAttribute("id", "datos");
    tabs.appendChild(tab_datos);
    let gen_dato = await gen_datos(meta);
    tab_datos.appendChild(gen_dato);

    /* tab tabla */
    let tab_tabla = document.createElement("div");
    tab_tabla.setAttribute("class", "mdl-tabs__panel is-active");
    tab_tabla.setAttribute("id", "tabla");
    tabs.appendChild(tab_tabla);
    let div_tabla = document.createElement("div");
    div_tabla.setAttribute("id", "div_tabla");
    tab_tabla.appendChild(div_tabla);
    let tabla = await dato_abierto(meta.dataset, datos);
    document.getElementById("div_tabla").appendChild(tabla);
    await dragtable();
    await externalLinks();

    /* Ajustes tabla */
    await aju_tabla(tab_tabla, meta, "div_tabla", id);

    /* tab mapa */
    if(meta.dataset.features.includes("geo")){
        let tab_mapa = document.createElement("div");
        tab_mapa.setAttribute("class", "mdl-tabs__panel");
        tab_mapa.setAttribute("id", "mapa");
        tabs.appendChild(tab_mapa);
        let div_mapa = document.createElement("div");
        div_mapa.setAttribute("id", "el_mapa");
        tab_mapa.appendChild(div_mapa);

        let cord = [];
        for(let dato of datos){
            cord.push(dato[meta.dataset.fields.find(search => search.type === "geo_point_2d").name]);
        }
        await carga_mapa(cord);
    }else{
        a_mapa.style.display = "none";
    }

    /* Actualizamos componentes mdl  */
    componentHandler.upgradeDom();

    /* Parche bug mdl-tabs, se mantiene clase is-active cuando se cambia de tab */
    for (let i = 0; i < document.getElementsByClassName('mdl-tabs__ripple-container').length; i++) {
        document.getElementsByClassName('mdl-tabs__ripple-container')[i].addEventListener('click', function() {
            for (let x = 0; x < document.getElementsByClassName('mdl-tabs__panel').length; x++) {
                if(document.getElementsByClassName('mdl-tabs__panel')[x].getAttribute("class") === "mdl-tabs__panel is-active"){
                    document.getElementsByClassName('mdl-tabs__panel')[x].setAttribute("class", "mdl-tabs__panel");
                }
            }
        });
    }
}