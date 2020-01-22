import {base, busqueda, datos} from "./page.js"

/* Deteción posificón actual de la pagina */
export async function detect_url() {
    /* Generación basica de la pagina */
    base();
    
    /* Tratado de la url */
    let url = new URL(location);
    let parm = new URLSearchParams(url.search);

    /* Deteción de tipo de url */
    switch (parm.get("tipo")) {
        /* Pagina inicial de busqueda de datos generales */
        case "busqueda":
            await busqueda(parm.get("valor"));
            break;
    
        /* Pagina de un dato en concreto */
        case "dato":
            await datos(parm.get("valor"));
            break;

        /* Por defecto carga la pagina inicial de busqueda si da error de detección */
        default:
            await busqueda("");
            break;
    }
}

/* Generación de url con parametros */
export async function set_url(arg) {
    let url = new URL(location);
    let parm = new URLSearchParams();
    if(typeof arg !== "undefined"){
        for(let par of arg){
            parm.set(par[0],par[1]);
        }
    }
    url.search = parm;
    window.location.href = url;
}

