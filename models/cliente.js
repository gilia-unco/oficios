'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CalificacionCliente = Schema({
    calificacion: {
        type: Schema.Types.ObjectId,
        ref: 'Calificacion'
    },
    fecha: Date    
});

//Esquema Cliente
//Hace falta realmente guardar el id, cuando puedo utilizar el dni?
var ClienteSchema = Schema({
    dni: {
        type: String,
        unique: true
    },
    nombre: String,
    apellido: String,
    telefono: String,
    email: String,
    foto: Image,// ver como guardarla 
    calificacion: [CalificacionCliente]
});
var Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;