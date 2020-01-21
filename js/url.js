import {base, busqueda, datos} from "./page.js"

/* Deteción posificón actual de la pagina */
export async function detect_url() {
    base();
    let url = new URL(location);
    let parm = new URLSearchParams(url.search);
    switch (parm.get("tipo")) {
        case "busqueda":
            await busqueda(parm.get("valor"));
            break;
    
        case "dato":
            await datos(parm.get("valor"));
            break;

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

