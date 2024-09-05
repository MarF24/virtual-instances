class Sistema{
    constructor(){
        this.arrayAdmins = [
            new Admin ("Admin", "1234"),
            new Admin ("Admin2", "1234"),
            new Admin ("Admin3", "1234"),
            new Admin ("Admin4", "1234"),
            new Admin ("Admin5", "1234"),
        ];

        //nombre, apellido, usuario, pass, tarjeta, cvc
        this.arrayUsers = [
            new Usuario ("Sebastian", "Fernandez", "SebaFer", "12345", "987654321", "123"),
            new Usuario ("Federico", "Colombo", "FedeCol", "12345", "987654321", "123"),
            new Usuario ("Sebastian", "Abreu", "LocoPicada", "12345", "987654321", "123"),
            new Usuario ("Cristiano", "Ronaldo", "Cr7", "12345", "987654321", "123"),
            new Usuario ("Ronaldo", "Nazario", "Fenomeno9", "12345", "987654321", "123"),
        ];
        
        this.usuarioLogueado = null

        this.arrayInstancias = [
            new Instancia ("c7.small", "U$S 20", "USD 2.50", "10"),
            new Instancia ("c7.medium", "U$S 30", "USD 3.50", "10"),
            new Instancia ("c7.large", "U$S 50", "USD 6.00", "10"),
            new Instancia ("r7.small", "U$S 35", "USD 4.00", "10"),
            new Instancia ("r7.medium", "U$S 50", "USD 6.50", "10"),
            new Instancia ("r7.large", "U$S 35", "USD 7.00", "10"),
            new Instancia ("i7.medium", "U$S 35", "USD 3.50", "10"),
            new Instancia ("i7.large", "U$S 35", "USD 6.50", "10"),
        ];

        this.alquileres = [
            new Alquiler (this.arrayUsers[1], this.obtenerInstanciaConID(2)),
            new Alquiler (this.arrayUsers[0], this.obtenerInstanciaConID(1)),
            new Alquiler (this.arrayUsers[0], this.obtenerInstanciaConID(4)),
            new Alquiler (this.arrayUsers[0], this.obtenerInstanciaConID(3)),
            new Alquiler (this.arrayUsers[0], this.obtenerInstanciaConID(3)),
            new Alquiler (this.arrayUsers[4], this.obtenerInstanciaConID(4)),
            new Alquiler (this.arrayUsers[4], this.obtenerInstanciaConID(2)),
            new Alquiler (this.arrayUsers[3], this.obtenerInstanciaConID(3)),
            new Alquiler (this.arrayUsers[3], this.obtenerInstanciaConID(7)),
            new Alquiler (this.arrayUsers[3], this.obtenerInstanciaConID(7)),
        ]

    }

    encenderApagarInstancia(idInstancia){ //Cambia de estado la instancia
        let user = this.usuarioLogueado
        let arrayInstanicas = this.obtenerInstanciasUsLog()
        for(let i=0; i < arrayInstanicas.length; i++){
            if(arrayInstanicas[i].id == idInstancia){ 
                if( arrayInstanicas[i].estado == "Apagado"){
                    arrayInstanicas[i].estado = "Encendido"
                    arrayInstanicas[i].cantEncendidos = arrayInstanicas[i].cantEncendidos + 1
                }else{
                    arrayInstanicas[i].estado = "Apagado"
                }
            }
        }
    }

    modificarSotckInstancias(id, stockNuevo){ // Modifica el stock de la instancia
        let instancia = this.obtenerInstanciaConID(id)
        instancia.stock = stockNuevo
    }

    obtenerStockInstanciaConID(id){ // retorna el stock de la instancia
        let resp = null
        for(let i=0; i<this.arrayInstancias.length; i++){
            if(id == this.arrayInstancias[i].id){
                resp = this.arrayInstancias[i].stock
            }
        }
        return resp
    }

    obtenerInstanciaConID(id){ // dado un id retorna la instancia
        let resp = null
        id = "INSTANCE_ID_" + id
        for(let i=0; i<this.arrayInstancias.length; i++){
            if(id == this.arrayInstancias[i].id){
                resp = this.arrayInstancias[i]
            }
        }
        return resp
    }

    obtenerInstanciasUsLog(){ // obtiene las Instancias del usuario logeado
        let instanciasUsuarioLog = [];
        for(let i=0; i<this.alquileres.length; i++){
            if(this.alquileres[i].usuario.id == this.usuarioLogueado.id){
                instanciasUsuarioLog.push(this.alquileres[i])
            }
        }

        return instanciasUsuarioLog
    }

    setUsuarioLogueado(user){ // setea el usuario que esta logeado
        let resp = null
        let aux = user.toLowerCase()

        for(let i= 0; i< this.arrayUsers.length; i++){
            if(aux == this.arrayUsers[i].usuario.toLowerCase()){
                resp = this.arrayUsers[i] 
            }
        }

        for(let k=0; k< this.arrayAdmins.length; k++){
            if (aux == this.arrayAdmins[k].usuario.toLowerCase()){
                resp = this.arrayAdmins[k]
            }
        }

        this.usuarioLogueado = resp
    }
    

    alquilarInstancia(idInstancia){ // crea un nuevo alquiler
        if(sistema.obtenerInstanciaConID(idInstancia).stock > 0){
            let obj = new Alquiler (this.usuarioLogueado , this.obtenerInstanciaConID(idInstancia))
            this.alquileres.push(obj)
            sistema.obtenerInstanciaConID(idInstancia).stock--
        }else{
            alert("No hay stock suficiente")
        }
    }

    adminCorrecto(usuario, contrasenia){ // verifica si el nombre de usuario y contraseña son correctos - ADMIN
        let esCorrecto = false
        for(let i=0 ; i < this.arrayAdmins.length && !esCorrecto; i++){
            if(this.arrayAdmins[i].usuario.toLowerCase() == usuario.toLowerCase() && this.arrayAdmins[i].contrasenia == contrasenia){
                esCorrecto = true
            }
        }

        return esCorrecto
    }

    nombreUsuarioExiste(user){ //comprueba si el nombre de usuario existe en el Sistema
        let resp = false
        let aux = user.toLowerCase()

        for(let i= 0; i< this.arrayUsers.length; i++){
            if(aux == this.arrayUsers[i].usuario.toLowerCase()){
                resp = true 
            }
        }

        for(let k=0; k< this.arrayAdmins.length; k++){
            if (aux == this.arrayAdmins[k].usuario.toLowerCase()){
                resp = true
            }
        }

        return resp
    }

    usuarioCorrecto(usuario, contrasenia){ //comprueba si el nombre de usuario y la contraseña son correctas - USUARIO
        let esCorrecto = false
        for(let i=0 ; i < this.arrayUsers.length && !esCorrecto; i++){
            if(this.arrayUsers[i].usuario.toLowerCase() == usuario.toLowerCase() && this.arrayUsers[i].contrasenia == contrasenia){
                esCorrecto = true
            }
        }
        return esCorrecto
    }

    mostrarLoginRegistro(){
        //Oculta div logueado User/Admin
        document.querySelector("#divPrincipal").style.display = "block"
        //Muestra div principal
        document.querySelector("#divAdmin").style.display = "none"
        document.querySelector("#divUsuario").style.display = "none"

    }
    
    mostrarPerfilUsuario(){
        //Muestra div Usuario
        document.querySelector("#divUsuario").style.display = "block"
        // Oculta div Admin/Prncipal
        document.querySelector("#divAdmin").style.display = "none"
        document.querySelector("#divPrincipal").style.display = "none"
    }

    mostrarPerfilAdmin(){
        //Muestra div Admin
        document.querySelector("#divAdmin").style.display = "block"
        // Oculta div User/Prncipal
        document.querySelector("#divUsuario").style.display = "none"
        document.querySelector("#divPrincipal").style.display = "none"
    }

    obtenerEstadoUsuario(user){
        let respuesta = ""
        for(let i= 0 ; i < this.arrayUsers.length && respuesta == ""; i++){
            if(this.arrayUsers[i].usuario.toLowerCase() === user.toLowerCase()){
                respuesta = this.arrayUsers[i].estado
            }
        }

        return respuesta
    }

    agregarUsuario(nombre, apellido, usuario, pass, tarjeta, cvc){ // crea el usuario
        let user = new Usuario (nombre, apellido, usuario, pass, tarjeta, cvc)

        this.arrayUsers.push(user)
    }

    obtenerUsuarioID(idNumber){ // devuelve un Objeto usuario a travez de un ID
        let respuesta = ""
        for(let i= 0 ; i < this.arrayUsers.length && respuesta == ""; i++){
            if(this.arrayUsers[i].id === idNumber){
                respuesta = this.arrayUsers[i]
            }
        }

        return respuesta
    }

    pasarActivo(id){ // cambia a estado "activo" un usuario utiliznado el ID
        let user = this.obtenerUsuarioID(id)
        user.estado = "Activo"
    }

    bloquearUsuario(id){ // cambia a estado "Bloqueado" un usuario utiliznado el ID
        let user = this.obtenerUsuarioID(id)
        user.estado = "Bloqueado"
    }

    borrarinstancias(id){
        let indiceAlquileres = []
        for(let i=0; i < this.alquileres.length; i++){
            let obj = this.alquileres[i]
            if(obj.usuario.id == id){ // Obtiene los indices utiliznado el parametro ID
                indiceAlquileres.push(i) //guarda los indice de los alquileres
            }
        }

        if(indiceAlquileres.length > 0){
            for(let i=0; i< indiceAlquileres.length; i++){
                let indice = indiceAlquileres[i]
                this.alquileres[indice].instancia.stock ++ // aumenta los stock en 1
            }
            for(let i= indiceAlquileres.length -1; i>= 0; i--){
                let indice = indiceAlquileres[i]
                this.alquileres.splice(indice, 1)   // borra los obj en esas posiciones 
            }
        }

    }

}


let userID = 1
class Usuario{
    constructor(nombre, apellido, usuario, pass, tarjeta, cvc){
        this.nombre = nombre;
        this.apellido = apellido;
        this.usuario = usuario;
        this.contrasenia = pass;
        this.tarjeta = tarjeta;
        this.cvc = cvc
        this.estado = "Pendiente"
        this.id = userID++
    }
}

class Admin{
    constructor(usuario, pass){
        this.usuario = usuario;
        this.contrasenia = pass;
    }
}

let idInstancias = 1
class Instancia{
    constructor(nombre, costo, costoEncendido, stock){
        this.nombre = nombre;
        this.costo = costo;
        this.costoEncendido = costoEncendido;
        this.stock = stock
        this.id = "INSTANCE_ID_" +idInstancias++
    }
    toString(){
        return `${this.nombre} - Precio: ${this.costo} - Costo encendido: ${this.costoEncendido} - Stock: ${this.stock}`
    }

}
let idAlquileres = 1
class Alquiler{
    constructor(usuario, instancia){
        this.instancia = instancia
        this.usuario = usuario;
        this.cantEncendidos = 0;
        this.estado = "Encendido";
        this.id = idAlquileres++
    }
}

