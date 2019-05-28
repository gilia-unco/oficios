'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CalificacionOficial = Schema({
    calificacion: {
        type: Schema.Types.ObjectId,
        ref: 'Calificacion'
    },
    fecha: Date    
});

var CategoriaOficial = Schema({
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    }    
});

//Esquema Oficial
//Hace falta realmente guardar el id, cuando puedo utilizar el dni?
var OficialSchema = Schema({
    dni: {
        type: String,
        unique: true
    },
    nombre: String,
    apellido: String,
    telefono: String,
    email: String,
    urgencia: Boolean,
    enServicio: Boolean, //Cada oficial se pone en servicio, por defecto true
    foto: Image,// ver como guardarla 
    calificacion: [CalificacionOficial],
    categoria: [CategoriaOficial]
});
var Oficial = mongoose.model('Oficial', OficialSchema);

module.exports = Oficial;