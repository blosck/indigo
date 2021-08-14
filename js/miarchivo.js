const valorMilla = 42

//Se crea un array vacío para utilizarlo más adelante.
let destinos = []

//Se establece un origen para la utilización de un json.
const URL_GET = './json/destinos.json'

//Se utiliza la información del json para completar el array destinos creado previamente.
$.getJSON(URL_GET, function(response, status){
    destinos = response

    //Creo de forma dinámica el manú lateral de ciudades y las opciones del cuadro cotizador.
    for (const destino of destinos){        
        listaDestinos.innerHTML += `<li class="destinos__item" onclick="mostrar(${destino.id})" id="destino${destino.id}">${destino.ciudad}</li>`
        campoCiudad.innerHTML += `<option class="destino${destino.id}" value="${destino.ciudad}">${destino.ciudad}</option>`
    }
})

//Se crea función con las acciones a realizar una vez se cliquée en cada uno de los destinos disponibles en el menú lateral.
function mostrar(id){
    const destino = destinos.find(ciudad => ciudad.id == id)
    const img = document.getElementById("img");
    const titulo = document.getElementById("destinos__h4");
    const descripcion = document.getElementById("destinos__p");
    $("#carouselExampleControls").hide();
    $("#destinos__h4").fadeOut();
    $("#destinos__p").fadeOut();
    $(".destinos__aside").html(`<h4 id="destinos__h4" class="destinos__h4 style="display:none";>${destino.ciudad}</h4><p id="destinos__p" class="destinos__p" style="display:none";>${destino.descripcion}</p>`)
    $(".img").hide()
    img.src = destino.img
    $(".img").delay(300).fadeIn(500)
    $(".destinos__h4").delay(1000).slideDown(700);
    $(".destinos__p").delay(500).slideDown(700);
}

//Se crea un constructor de objeto.
class datosViaje {
    constructor (detalle){
        this.ciudad = detalle.city;
        this.habitacion = detalle.room;
        this.noches = detalle.nights;
        this.costoNoche = detalle.costPerNight;
        this.costoTotal = detalle.totalCost;
        this.millas = detalle.miles;
        this.millasAPesos = detalle.milesToPesos;
        this.costoFinal = detalle.finalCost;
    }
}

let campoCiudad = document.getElementsByClassName("mainForm__destino1")[0];
let campoNoches = document.getElementsByClassName("mainForm__noches1")[0];
let campoHab = document.getElementsByClassName("mainForm__hab1")[0];
let campoMillas = document.getElementsByClassName("mainForm__millas1")[0];
let listaDestinos = document.getElementsByClassName("destinos__lista")[0];

//Se mantiene oculta la tabla que aún no tiene los detalles del canje y el boton de pago.
$(".canje").hide();
$(".pagar").hide();

//Se muestra alerta una vez se selecciones el tipo de habitación para que el cliente sepa cuántos pasajeros esperará el hotel.
$(".mainForm__hab1").change((e) => {
    $(".mainForm__error").html("")
    if(e.target.value == "Single"){
        $(".mainForm__error").prepend(`<p class="p1" style="display: none">Se esperará la llegada de 1 pasajero.</p>`)
        $(".p1").slideDown(200, function(){
            $(".p1").delay(3000).slideUp(200)})
    }else if(e.target.value == "Doble"){
        $(".mainForm__error").prepend(`<p class="p1" style="display: none">Se esperará la llegada de 2 pasajeros.</p>`)
        $(".p1").slideDown(200, function(){
            $(".p1").delay(3000).slideUp(200)})
    }else{
        $(".p1").css({display:"none"})
    }
})

// Comienza la Validación.
let formulario = document.getElementsByClassName("mainForm__form")[0];
formulario.addEventListener ("submit", validarFormulario)

function validarFormulario(e) {
    e.preventDefault();
    
    const ciudad1 = campoCiudad.value
    const noches1 = campoNoches.value
    const hab1 = campoHab.value
    const milla1 = campoMillas.value.trim()
    let okey = true
    $(".mainForm__validar").html("")

    // Se muestra advertencia en caso que falte por indicar un destino.
    if (ciudad1 == "none"){
        $(".mainForm__validar").append(`<p class="p2" style="display: none">Debes seleccionar una destino para cotizar tu canje.</p>`)
        $(".p2").slideDown(1000).delay(4500).slideUp(1500)
        okey = false
    }

    //  Se muestra advertencia en caso que falte por indicar el tipo de habitación.
    if (hab1 == "Opciones"){
        $(".mainForm__validar").append(`<p class="p3" style="display: none">Debes seleccionar un tipo de habitación.</p>`)
        $(".p3").slideDown(1000).delay(4500).slideUp(1500)
        okey = false
    }

    //Se muestra advertencia en caso que falte por indicar el número de millas a canjear.
    if (milla1 > 1000 || milla1 < 100){
        $(".mainForm__validar").append(`<p class="p4" style="display: none">Puedes canjear como mínimo 100 millas y como máximo 1.000.</p>`)
        $(".p4").slideDown(1000).delay(4500).slideUp(1500)
        okey = false
    }

    /*Una vez se confirme que se cuenta con todos los datos requeridos para la cotización, utilizan los datos correspondiente
    que coincidan con la ciudad de destino seleccionada*/
    if (okey) {
        const destinoElegido = destinos.find( destino => destino.ciudad === ciudad1)        
        let precio = destinoElegido.single

        //Se modifica el "Costo por noche" en caso que lahabitación sea indicada como doble.
        if (hab1 === "Doble"){
            precio = destinoElegido.doble
        }
        
        //Se crea un nuevo objeto con los datos del viaje.
        const canje = new datosViaje ({city: ciudad1, room: hab1, nights: noches1, costPerNight: precio,
                                        totalCost: (precio * noches1), miles: milla1, milesToPesos: (milla1 * valorMilla),
                                        finalCost: ((precio * noches1)-(milla1 * valorMilla))})
        
        // Se guardan los datos del canje del viaje en localStorage y se aplica stringify para visualizarlo mejor.
        localStorage.setItem('detallesCanje', JSON.stringify(canje))
        
        // Se establecen nuevos selectores para manipular el DOM de la tabla.
        let block1 = document.getElementsByClassName("block1")[0]
        let block2 = document.getElementsByClassName("block2")[0]
        let block3 = document.getElementsByClassName("block3")[0]
        let block4 = document.getElementsByClassName("block4")[0]
        let block5 = document.getElementsByClassName("block5")[0]
        let block6 = document.getElementsByClassName("block6")[0]
        let block7 = document.getElementsByClassName("block7")[0]
        let block8 = document.getElementsByClassName("block8")[0]

        // Se modifican los selectores establecidos previamente.
        block1.innerHTML = canje.ciudad
        block2.innerHTML = canje.noches
        block3.innerHTML = canje.habitacion
        block4.innerHTML = ("$ " + canje.costoNoche)
        block5.innerHTML = ("$ " + canje.costoTotal)
        block6.innerHTML = canje.millas
        block7.innerHTML = ("$ " + canje.millasAPesos)
        block8.innerHTML = ("$ " + canje.costoFinal)
        
        //Muestro con jQuery la tabla que estaba oculta y con la información del canje ya asociada.
        $(".canje").slideDown();
        $(".pagar").delay(300).slideDown();      
    }
}

//Oculta la tabla con la información del canje cuando se quiere cotizar con otras opciones.
$(".denuevo").click(function(){
    $(".canje").slideUp();
    $(".pagar").slideUp();
});





