'use strict'; 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombre: String,
    descripcion: String
});
var Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = Categoria;