window.addEventListener("load", iniciar)

let sistema = new Sistema();

function iniciar(){
    get("rBtn").addEventListener("click", agregarUsuario)
    get("btnLogin").addEventListener("click", login)
    get("userLogout").addEventListener("click", logout)
    get("adminLogout").addEventListener("click", logout)
    get("btnAlquilar").addEventListener("click", alquilar)
    sistema.mostrarLoginRegistro()
}

function get(id){ // funcion para obtener HTML
    return document.querySelector("#"+id)
}


function agregarUsuario(){  // funcion que toma datos del HTML, verifica y agrega el usuario al sistema
    let nombre = get("rNombre").value
    let apellido = get("rApellido").value
    let user = get("rUser").value
    let pass = get("rPass").value
    let tarjeta = get("rTarjeta").value
    let cvc = get("rCVC").value
    
    let cvcAux = cvc.toString()
    //let esCorreto = false 

    if(nombre.length == 0 || apellido.length == 0 || user.length == 0 || pass.length == 0 || tarjeta == " " || cvcAux.length == 0){
        alert("Todos los campos son obligatorios")
    }else{
        if(sistema.nombreUsuarioExiste(user)){
            alert("Usuario ya existe")
        }else if(!passCorrecta(pass)){
            alert("Formato contraseña incorrecta")
        }else if(cvcAux.length !== 3 && isNaN(cvcAux)){
            alert("CVC incorrecto")
        }else if(!comprobarTarjeta(tarjeta)){
            alert("Tarjeta incorrecta")
        }else if(!todosAlfanumericos(user)){
            alert("El usuario debe ser alfanumerico")
        }else{
            sistema.agregarUsuario(nombre, apellido, user, pass, tarjeta, cvc)
            alert("Registro completado, pendiente de aprobacion")
            get("rForm").reset()
        }
    }
    
}

function todosAlfanumericos(string) { // verifica si un string es alfanumerico
    let resp = true
    for (let i = 0; i < string.length; i++) {
        let charCode = string.charCodeAt(i);
        if (!(charCode >= 48 && charCode <= 57) && !(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode != 46) {
            resp = false
        }
    }
    return resp
}

function passCorrecta(contrasenia){ //Verifica datos de la contraseña
    let resp = false
    let mayuscula = false
    let minuscula = false
    let numero = false

    if (contrasenia.length >4) {
        for(let i= 0; i < contrasenia.length; i++){
            if (contrasenia.charCodeAt(i) >= 65 && contrasenia.charCodeAt(i)<= 90){
                mayuscula = true
            }else if(contrasenia.charCodeAt(i) >= 97 && contrasenia.charCodeAt(i)<= 122){
                minuscula = true
            }else if(contrasenia.charCodeAt(i) >= 48 && contrasenia.charCodeAt(i)<= 57){
                numero = true
            }
        }
    }

    if (mayuscula && minuscula && numero){
        resp = true
    }

    return resp
}

function comprobarTarjeta(numero){ // funcion que comprueba si los datos de la tarjeta son correctos
    let respuestaFinal = false
    let soloNumero = false
    let lugar = false
    if(numero.length == 19){ // Verifica longitud 
        for(let i= 0; i< numero.length; i++){
            if(i == 4 ||i == 9 ||i == 14){
                if(numero.charAt(i) == "-"){ // Verifica  "-"
                    lugar = true
                }
            }else{
                if(numero.charCodeAt(i) >= 48 && numero.charCodeAt(i) <= 57 ){ // Que solo contenga numeros
                    soloNumero = true
                }
            }
        }

        if ( soloNumero && lugar){
            numero = numero.replaceAll("-", "")
            respuestaFinal = algoritmoLuhn(numero) // Setea la respuesta final
        }
    }

    return respuestaFinal
}

function algoritmoLuhn(pNumero) {
    let suma = 0;
    let digitoVerificadorX = Number(pNumero.charAt(pNumero.length - 1));
    let contador = 0;
    let haynro = true;
    let i = pNumero.length - 2; 
  
    while (i >= 0 && haynro) {
      //Obtener el numero
      let caracter = pNumero.charAt(i);
      //Valida que el número sea válido
      if (!isNaN(caracter)) {
        let num = Number(caracter);
        //Duplicando cada segundo dígito
        if (contador % 2 == 0) {
          num = duplicarPar(num); //porque si es mayor a 9 se deben sumar.
        }
        suma += num;
      } else {
        haynro = false;
      }
      i--;
      contador++;
    }
    let digitoVerificadorValido = checkDigito(suma, digitoVerificadorX);
    let modulodelasumaValiado = checkModulo(suma, digitoVerificadorX);
    return digitoVerificadorValido && modulodelasumaValiado;
  
  }
  
  function duplicarPar(pNum) {
    pNum = pNum * 2;
    if (pNum > 9) {
      
      pNum = 1 + (pNum % 10);
    }
    return pNum;
  }
  
  function checkDigito(pSuma, pDigito) {
  
    let total = 9 * pSuma;
    let ultimoNro = total % 10
    return ultimoNro === pDigito;
  }
  
  function checkModulo(pSuma, pDigito) {
   
    let total = pSuma + pDigito;
    let validacionFinal = false;
    if (total % 10 === 0 && total !== 0) {
      validacionFinal = true;
    }
    return validacionFinal;
  }

function login(){ // Funcion principal de login
    let user = get("inputUsuario").value
    let pass = get("inputPass").value

    if(sistema.adminCorrecto(user, pass)){ // Comprueba si es Admin
        sistema.setUsuarioLogueado(user)
        sistema.mostrarPerfilAdmin()
        cargarTablaUsuarios()
        cargarTablaStock()
        cargarComboStock()
        cargarTablaInformes()
        get("loginForm").reset()
    }else if(sistema.usuarioCorrecto(user, pass)){
        // verifica si puede logear dependiendo de su "estado"
        if(sistema.obtenerEstadoUsuario(user) == "Pendiente"){
            alert("Usuario pendiente de aprobación")
        }else if(sistema.obtenerEstadoUsuario(user) == "Bloqueado"){
            alert("Usuario bloqueado")
        }else{
            sistema.setUsuarioLogueado(user)
            sistema.mostrarPerfilUsuario()
            mensajeUsuario()
            cargarComboInstancias()
            cargarInstanciasUsuario()
            cargarTablaCostoInstancias()
            eventosRadio()
            get("loginForm").reset()
        }
    }else{
        alert("Usuario/contraseña incorrectos")
    }
}

function mensajeUsuario(){ // Mensaje de Bienvendia 
    txt = ""
    if(sistema.usuarioLogueado.nombre != undefined){
        txt = `¡Bienvenido ${sistema.usuarioLogueado.nombre} ${sistema.usuarioLogueado.apellido}! - (${sistema.usuarioLogueado.usuario})`
    }

    get("nombreUserLog").innerHTML = txt
}

function logout(){ // Coloca en null al usuarioLogeado y muestra el login
    sistema.usuarioLogueado = null
    sistema.mostrarLoginRegistro()
}

function cargarTablaUsuarios(){ // tabla de todos los usuarios
    let txt =""
    for(i=0; i < sistema.arrayUsers.length; i++){
        let objUsuario = sistema.arrayUsers[i]
        let btn = ""
        if(sistema.arrayUsers[i].estado == "Pendiente" || sistema.arrayUsers[i].estado == "Bloqueado"){
            btn = `<input type="button" value="Activar" id="${objUsuario.id}-estado" class="activarEstado"></input>`
        }else{
            btn = `<input type="button" value="Bloquear" id="${objUsuario.id}-estado" class="bloquearEstado"></input>`
        }
        txt +=
        `
        <tr>
            <td>${objUsuario.nombre} ${objUsuario.apellido}</td>
            <td>${objUsuario.usuario}</td>
            <td>${objUsuario.contrasenia}</td>
            <td>${objUsuario.id}</td>
            <td>${objUsuario.estado}</td>
            <td>${btn}</td>
        </tr>
        `
    }
    get("tablaUsuarios").innerHTML = txt

    let arrayBtnActivar = document.querySelectorAll(".activarEstado")
    for(let i= 0; i<arrayBtnActivar.length; i++){
        arrayBtnActivar[i].addEventListener("click", activarUser)
    }

    let arrayBtnBloquear = document.querySelectorAll(".bloquearEstado")
    for(let i= 0; i<arrayBtnBloquear.length; i++){
        arrayBtnBloquear[i].addEventListener("click", bloquearUser)
    }

}

function activarUser(){
    let id = parseInt(this.id)
    sistema.pasarActivo(id)
    cargarTablaUsuarios()
}

function bloquearUser(){
    let id = parseInt(this.id)
    sistema.bloquearUsuario(id)
    sistema.borrarinstancias(id)
    cargarTablaStock()
    cargarTablaUsuarios()
    cargarTablaInformes()
}

 function cargarComboInstancias(){
     let txt = ""
     for(let i= 0; i < sistema.arrayInstancias.length; i++){
         let obj = sistema.arrayInstancias[i]
         txt+= `<option value="${obj.id}">${obj}</option>`
     }

     get("comboMaquinas").innerHTML = txt
 }

function cargarInstanciasUsuario(){
    let txt = ""
    let maquinasUsuario = sistema.obtenerInstanciasUsLog()
    for(let i= 0; i< maquinasUsuario.length; i++){
        let obj = maquinasUsuario[i]
        let btn = `<input type="button" value="Encender" id="${obj.id}-estadoInstancia" class="prenderApaInstancia"></input>`
        if(obj.estado == "Encendido"){
            btn =`<input type="button" value="Apagar" id="${obj.id}-estadoInstancia" class="prenderApaInstancia"></input>`
        }
        txt+= 
        `<tr>
            <td>${obj.instancia.nombre}</td>
            <td>${obj.estado}</td>
            <td>${obj.cantEncendidos}</td>
            <td>${btn}</td>
        </tr>`
    }

    get("tablaInstanciasAlquiladas").innerHTML = txt

    let btnsEstado = document.querySelectorAll(".prenderApaInstancia")
    for(let i=0; i< btnsEstado.length; i++){
        btnsEstado[i].addEventListener("click", prenderApaInstancia)
    }

}

function prenderApaInstancia(){ // prende o apaga una instancia
    let id = parseInt(this.id)
    sistema.encenderApagarInstancia(id)
    if(get("radioTodas").checked){
        cargarInstanciasUsuario()
    }else if(get("radioApagadas").checked){
        cargarInstanciasApagadas()
    }else{
        cargarInstanciasPrendidas()
    }
    cargarTablaCostoInstancias()
}


function cargarInstanciasPrendidas(){
    let txt = ""
    let maquinasUsuario = sistema.obtenerInstanciasUsLog()
    for(let i= 0; i< maquinasUsuario.length; i++){
        let obj = maquinasUsuario[i]
        let btn = `<input type="button" value="Encender" id="${obj.id}-estadoInstancia" class="prenderApaInstancia"></input>`
        if(obj.estado == "Encendido"){
            btn =`<input type="button" value="Apagar" id="${obj.id}-estadoInstancia" class="prenderApaInstancia"></input>`
        }
        if(obj.estado == "Encendido"){
            txt+= 
            `<tr>
                <td>${obj.instancia.nombre}</td>
                <td>${obj.estado}</td>
                <td>${obj.cantEncendidos}</td>
                <td>${btn}</td>
            </tr>`

        }
    }

    get("tablaInstanciasAlquiladas").innerHTML = txt

    let btnsEstado = document.querySelectorAll(".prenderApaInstancia")
    for(let i=0; i< btnsEstado.length; i++){
        btnsEstado[i].addEventListener("click", prenderApaInstancia)
    }

}

function cargarInstanciasApagadas(){
    let txt = ""
    let maquinasUsuario = sistema.obtenerInstanciasUsLog()
    for(let i= 0; i< maquinasUsuario.length; i++){
        let obj = maquinasUsuario[i]
        let btn = `<input type="button" value="Encender" id="${obj.id}-estadoInstancia" class="prenderApaInstancia"></input>`
        if(obj.estado == "Encendido"){
            btn =`<input type="button" value="Apagar" id="${obj.id}-estadoInstancia" class="prenderApaInstancia"></input>`
        }
        if(obj.estado == "Apagado"){
            txt+= 
            `<tr>
                <td>${obj.instancia.nombre}</td>
                <td>${obj.estado}</td>
                <td>${obj.cantEncendidos}</td>
                <td>${btn}</td>
            </tr>`

        }
    }

    get("tablaInstanciasAlquiladas").innerHTML = txt

    let btnsEstado = document.querySelectorAll(".prenderApaInstancia")
    for(let i=0; i< btnsEstado.length; i++){
        btnsEstado[i].addEventListener("click", prenderApaInstancia)
    }

}

function eventosRadio(){ // funcion que agrega eventos radioBtn
    get("radioEncendidas").addEventListener("click", cargarInstanciasPrendidas)
    get("radioApagadas").addEventListener("click", cargarInstanciasApagadas)
    get("radioTodas").addEventListener("click", cargarInstanciasUsuario)
}

function alquilar(){ // Alquilar instancia
    let idInstancia = get("comboMaquinas").value
    idInstancia = idInstancia[idInstancia.length-1]
    sistema.alquilarInstancia(idInstancia)
    cargarComboInstancias()
    cargarInstanciasUsuario()
    cargarTablaCostoInstancias()
}

function cargarTablaCostoInstancias(){ // carga la tabla de ingresos (admin)
    let maquinasUsuario = sistema.obtenerInstanciasUsLog()
    let txt = ""
    for(let i=0; i < sistema.arrayInstancias.length; i++){ //Recorre todas las instancias
        let cantEncendidos = 0
        let costoTotal = 0
        let obj2 =  sistema.arrayInstancias[i]
        let sumaTotal = 0
        
        for(let k=0; k< maquinasUsuario.length; k++){ // recore las intancias del usuario
            let obj = maquinasUsuario[k]
            
            if(sistema.arrayInstancias[i].nombre == obj.instancia.nombre){ // 
                
                let aux2 = obj.instancia.costo.split(" ")
                aux2 = Number(aux2[1]) // costo Maquina sin Moneda
                cantEncendidos += obj.cantEncendidos
                costoTotal += aux2 // costo total de las unidades sin encendidos

            }
        }
        
        let aux = obj2.costoEncendido.split(" ")
        aux = Number(aux[1]) //costo Encendido final sin moneda
        sumaTotal = (cantEncendidos * aux) + costoTotal // suma total de encendidos y precio de maquinas

        if(costoTotal > 0){
            txt+= 
            `<tr>
                <td>${obj2.nombre}</td>
                <td>${obj2.costoEncendido}</td>
                <td>${cantEncendidos}</td>
                <td> U$S ${sumaTotal}</td>
            </tr>`
        }    
    }


    get("tablaInstanciasCosto").innerHTML = txt

}

function cargarTablaStock(){
    let txt = ""
    for(let i=0; i < sistema.arrayInstancias.length; i++){
        let obj = sistema.arrayInstancias[i]
        txt+= 
            `<tr>
                <td>${obj.nombre}</td>
                <td>${obj.stock}</td>
            </tr>`
    }

    get("tablaStock").innerHTML = txt
}

function cargarComboStock(){
    let txt = ""
    for(let i=0; i < sistema.arrayInstancias.length; i++){
        let obj = sistema.arrayInstancias[i]
        txt+= 
            `<option value="${obj.id}">${obj.nombre}</option>`
    }

    get("comboStock").innerHTML = txt

    get("btnModificarStock").addEventListener("click", modificarStock)
}
//'#1-stockBtnNumber
function modificarStock(){
    let id = get("comboStock").value
    id = parseInt(id[id.length-1])
    let stockNuevo = get("inputStock").value
    sistema.modificarSotckInstancias(id, stockNuevo)
    cargarTablaStock()
}

//Instancia	Alquiladas	Ingresos
function cargarTablaInformes(){
    let txt=""
    let ingresosTotal = 0
    
    for(let k=0; k< sistema.arrayInstancias.length; k++){
        let instancia =sistema.arrayInstancias[k]
        let alquiladas = 0
        let ingresos= 0
        for(let i=0; i< sistema.alquileres.length; i++){
            let obj=sistema.alquileres[i]
            if(instancia.nombre == obj.instancia.nombre){
                alquiladas++
                let aux = obj.instancia.costoEncendido.split(" ")
                aux = Number(aux[1])  //costo Encendido final sin moneda
                
                let aux2 = obj.instancia.costo.split(" ")
                aux2 = Number(aux2[1])// costo Maquina sin Moneda

                
                ingresos += (obj.cantEncendidos * aux) + aux2
                
                ingresosTotal += ingresos
            }
    
        }
        
        if(alquiladas > 0){
            txt +=
            `<tr>
                <td>${instancia.nombre}</td>
                <td>${alquiladas}</td>
                <td> U$S ${ingresos}</td>
            </tr>`
        }
    }
    get("ingresosTotales").innerHTML = `Ingresos totales: U$S ${ingresosTotal}`
    get("tablaInformeMaquinas").innerHTML = txt
}