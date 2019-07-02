'use strict'

var Categoria = require('../models/categoria');

// FUNCIONES
function getCategorias(req, res){
    Categoria.find({}, function (err, categorias) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!categorias) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: categorias
        });
    });
}

function cargarCategoria(req, res) {
    if (!req.body.nombreCategoria) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso nombre'
        });
    }
    if (!req.body.descripcionCategoria) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso descripcion'
        });
    }


    var nuevaCategoria = new Categoria({
        nombre: req.body.nombreCategoria,
        descripcion: req.body.descripcionCategoria,
    })

    nuevaCategoria.save().then(function (nuevaCategoria) {
        res.status(201).json({
            message: 'Categoria creada',
            obj: nuevaCategoria
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("nombre")) // Esta bien esto?
                msj = "Nombre de Categoria";
           
            return res.status(404).json({
                title: 'Error',
                error: msj + ' existente.'
            });
        }
        return res.status(404).json({
            title: 'Error',
            error: err
        });
    });
}

function editarCategoria(req, res) {
    Categoria.findById(req.params.idCategoria, function (err, categoria) { // idCategoria es el id generado por mongodb?
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!categoria) {
            return res.status(404).json({
                title: 'Error',
                error: 'Categoria no encontrada'
            });
        }

        categoria.nombre=req.body.nombreCategoria,
        categoria.descripcion= req.body.descripcionCategoria,

        categoria.save().then(function (categoria) {
            res.status(200).json({
                message: 'Success',
                obj: categoria
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarCategoria(req, res){
    Categoria.findOne({'_id': req.params.idCategoria})
    .exec(function (err, categoria) {
        if (categoria) {
            categoria.remove().then(function (categoriaEliminada) {
                return res.status(200).json({
                    message: 'Categoria eliminada correctamente',
                    obj: categoriaEliminada
                });
            }, function (err) {
                return res.status(400).json({
                    title: 'Error',
                    error: err.message
                });
            });
        }
        else {
            return res.status(404).json({
                title: 'Error',
                error: err.message
            });
        }
    });
}