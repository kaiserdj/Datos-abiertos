export function carga_json(url) {
    return new Promise((resolve, reject) => {
        let ajax = new XMLHttpRequest();

        ajax.open('GET', url, true);
        ajax.send();

        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    resolve(JSON.parse(ajax.responseText));
                } else {
                    reject();
                }
            }
        };
    });
}


