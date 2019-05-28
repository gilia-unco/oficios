'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstadoPedido = Schema({
    estado: {
        type: Schema.Types.ObjectId,
        ref: 'Estado'
    },
    fecha: Date    
});

var CalificacionPedido = Schema({
    calificacion: {
        type: Schema.Types.ObjectId,
        ref: 'Calificacion'
    },
    fecha: Date    
});

var CategoriaPedido = Schema({
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    }    
});

//Esquema pedido
var PedidoSchema = Schema({
    numero: {
        type: Number,
        unique: true
    },
    estadosPedido: [EstadoPedido],
    calificacion: [CalificacionPedido],
    categoria: [CategoriaPedido],
    fecha: Date,

    //Relacion con Cliente
    cliente:{
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },

    //Relacion con Categoria
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    },

    //Relacion con Oficial, guardo el oficial
    oficial:{
        type: Schema.Types.ObjectId,
        ref: 'Oficial'
    }    
});
var Pedido = mongoose.model('Pedido', PedidoSchema);

module.exports = Pedido;