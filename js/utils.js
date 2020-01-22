import {svg} from "./svg.js";

/* Deteción de enlaces */
export async function detectar_enlace(text) {
    let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return text.replace(urlRegex, function (url, b, c) {
        let url2 = (c == 'www.') ? 'http://' + url : url;
        return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
    })
}

/* Detectar enlaces e inyectar target _blank */
export async function externalLinks() {
    let origin = window.location.origin;
    let a = document.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
        let link = a[i];
        if (link.href && link.href.indexOf(origin) != 0)
            link.setAttribute("target", "_blank");
    }
};

/* Funcion para comprobar si es un numero */
export function numero (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/* easter egg */
export function egg() {
    let dialog = document.createElement("dialog");
    dialog.setAttribute("class", "mdl-dialog");
    let h4 = document.createElement("h4");
    h4.setAttribute("class", "mdl-dialog__title");
    h4.innerText = "Corre abre la consola";
    dialog.appendChild(h4);
    let div = document.createElement("div");
    div.setAttribute("class", "mdl-dialog__actions");
    dialog.appendChild(div);
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "mdl-button close");
    button.innerText = "Cerrar";
    div.appendChild(button);
    dialog.appendChild(div);
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.remove();
    });

    console.clear();
    const textStyle = [
        'color: red',
        'font-size: 30px',
        ].join(';');
      const imageStyle = [
        'background-image: url("https://media.giphy.com/media/sXOj0wtpyELdu/source.gif")',
        'background-size: cover',
        'padding: 150px 300px'
        ].join(';');
      // es una broma 😸
      console.log('%cTienes 6 segundos para contar todos los gatos', textStyle);
      setTimeout(function() {
        console.log('%c ', imageStyle);
      }, 5000);
      setTimeout(function() {
        console.clear();
        dialog.remove();
        const style = [
            'background: #000',
            'color: #fff',
            'padding: 10px 20px',
            'line-height: 35px'
            ].join(';');
          console.log('%c Programado por Kaiserdj ♥️', style);
          const svgDataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
          console.log('%c ', `
          background-image: url(${ svgDataUrl });
          padding-bottom: 100px;
          padding-left: 100px;
          margin: 20px;
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
        `);
      }, 11000);
}