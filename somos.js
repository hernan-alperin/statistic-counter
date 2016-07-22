// para que se lea fácil los millones, miles.
function separadorDeMiles(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}

var proyecciones = [{
    fecha: new Date(2013, 7, 1, 0, 0),
    habitantes: 42202935
}, {
    fecha: new Date(2014, 7, 1, 0, 0),
    habitantes: 42669500
}, {
    fecha: new Date(2015, 7, 1, 0, 0),
    habitantes: 43131966
}];

function margenes(fecha) {
    if (fecha < proyecciones[0].fecha) return "fecha anterior a proyecciones, buscar fuente con datos previos";
    var p = 0;
    while (fecha > proyecciones[p].fecha) p++;
    if (p > proyecciones.length) return "fecha posterior a proyecciones, extraploar o buscar fuente con datos previos";
    inferior = proyecciones[p - 1];
    superior = proyecciones[p];
    return {
        inferior: inferior,
        superior: superior
    };
}

function tiempoPasado(milisegundos) {
    var segundos = Math.round(milisegundos / 1000);
    var segundos_s = segundos % 60;
    var segundos_t = segundos_s ? segundos_s + " segundo" + plural(segundos_s) + ", " : "";
    var minutos = Math.floor(segundos / 60);
    var minutos_s = minutos % 60;
    var minutos_t = minutos_s ? minutos_s + " minuto" + plural(minutos_s) + ", " : "";
    var horas = Math.floor(minutos / 60);
    var horas_s = horas % 24;
    var horas_t = horas_s ? horas_s + " hora" + plural(horas_s) + ", " : "";
    var dias = Math.floor(horas / 24);
    var dias_t = dias ? dias + " dia" + plural(dias) + ", " : "";

    function plural(n) {
        return n >= 2 ? 's' : '';
    }
    return dias_t + horas_t + minutos_t + segundos_t;
}


//actualiza el contador cada n milisegundos
var actualiza = 1000;

// función que calcula y escribe el calculo
// el tiempo en días, horas, minutos y segundos
// que faltan para la variable futuro
function somos() {
    var ahora = new Date();
    var margen = margenes(ahora);

    var grano = 1000;
    var tiempo = (ahora - margen.inferior.fecha) / grano;
    var lapso = (margen.superior.fecha - margen.inferior.fecha) / grano;
    var deltaLogPobl = Math.log(margen.superior.habitantes) - Math.log(margen.inferior.habitantes);
    var tasa_crecimiento_por_grano = Math.exp(deltaLogPobl / lapso);
    var cuantos = Math.round(margen.inferior.habitantes * Math.pow(tasa_crecimiento_por_grano, tiempo));
    cuantos = separadorDeMiles(cuantos);

    var segundos = Math.round(tiempo * grano / 1000);
    var minutos = Math.floor(segundos / 60);
    var segundos_s = segundos % 60;
    var horas = Math.floor(minutos / 60);
    var minutos_s = minutos % 60;
    var dias = Math.floor(horas / 24);
    var horas_s = horas % 24;

    document.getElementById('texto').innerHTML =
        "Ahora somos aproximadamente " + cuantos + " habitantes";
    if (tiempo > 0) document.getElementById('texto').innerHTML += " y pasaron " + tiempoPasado(tiempo * grano) + " desde la última proyección oficial usada.";

    setTimeout(function () {
        somos();
    }, actualiza);
}
somos();
