'use strict'

var Oficial = require('../models/oficial');

// FUNCIONES
function getOficiales(req, res){
    Oficial.find({}, function (err, oficiales) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!oficiales) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: oficiales
        });
    });
}

function cargarOficial(req, res) {
    if (!req.body.dniOficial) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso dni'
        });
    }
    if (!req.body.nombreOficial) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso nombre'
        });
    }
    if (!req.body.apellidoOficial) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso apellido'
        });
    }
    if (!req.body.telefonoOficial) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso telefono'
        });
    }
    

    var nuevoOficial = new Oficial({
        dni: req.body.dniOficial,
        nombre: req.body.nombreOficial,
        apellido: req.body.apellidoOficial,
        telefono: req.body.telefonoOficial,
        email: req.body.emailOficial,
        urgencia: req.body.urgenciaOficial,
        enServicio: true,
        foto: req.body.fotoOficial,

    })

    nuevoOficial.save().then(function (nuevoOficial) {
        res.status(201).json({
            message: 'Oficial creado',
            obj: nuevoOficial
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("dni"))
                msj = "Dni de Oficial";
           
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

function editarOficial(req, res) {
    Oficial.findById(req.params.idOficial, function (err, oficial) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!oficial) {
            return res.status(404).json({
                title: 'Error',
                error: 'Oficial no encontrado'
            });
        }

        oficial.dni= req.body.dniOficial,
        oficial.nombre=req.body.nombreOficial,
        oficial.apellido= req.body.apellidoOficial,
        oficial.telefono= req.body.telefonoOficial,
        oficial.email= req.body.emailOficial,
        oficial.urgencia= req.body.urgenciaOficial,
        oficial.enServicio= true,
        oficial.foto= req.body.fotoOficial,

        oficial.save().then(function (oficial) {
            res.status(200).json({
                message: 'Success',
                obj: oficial
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarOficial(req, res){
    Oficial.findOne({'_id': req.params.idOficial})
    .exec(function (err, oficial) {
        if (oficial) {
            oficial.remove().then(function (oficialEliminado) {
                return res.status(200).json({
                    message: 'Oficial eliminado correctamente',
                    obj: oficialEliminado
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

// EXPORT
module.exports = {
    getOficiales,
    cargarOficial,
    editarOficial,
    eliminarOficial
}

