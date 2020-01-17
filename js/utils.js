export async function detectar_enlace(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return text.replace(urlRegex, function (url, b, c) {
        var url2 = (c == 'www.') ? 'http://' + url : url;
        return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
    })
}

export async function externalLinks() {
    var origin = window.location.origin;
    var a = document.getElementsByTagName("a");
    for (var i = 0; i < a.length; i++) {
        var link = a[i];
        if (link.href && link.href.indexOf(origin) != 0)
            link.setAttribute("target", "_blank");
    }
};

export function numero (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}