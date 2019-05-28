'use strict'; 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CalificacionSchema = Schema({
    observacion: String,
    puntaje: Number
});
var Calificacion = mongoose.model('Calificacion', CalificacionSchema);

module.exports = Calificacion;