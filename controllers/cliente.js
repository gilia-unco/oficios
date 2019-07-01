'use strict'

var Cliente = require('../models/cliente');

// FUNCIONES
function getClientes(req, res){
    Cliente.find({}, function (err, clientes) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!clientes) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: clientes
        });
    });
}

function cargarCliente(req, res) {
    if (!req.body.dniCliente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso dni'
        });
    }
    if (!req.body.nombreCliente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso nombre'
        });
    }
    if (!req.body.apellidoCliente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso apellido'
        });
    }
    if (!req.body.telefonoCliente) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso telefono'
        });
    }
    

    var nuevoCliente = new Cliente({
        dni: req.body.dniCliente,
        nombre: req.body.nombreCliente,
        apellido: req.body.apellidoCliente,
        telefono: req.body.telefonoCliente,
        email: req.body.emailCliente,        
        foto: req.body.fotoCliente,
    })

    nuevoCliente.save().then(function (nuevoCliente) {
        res.status(201).json({
            message: 'Cliente creado',
            obj: nuevoCliente
        });

    }, function (err) {
        if (err.code == 11000) {
            var msj = ""
            //Catching index name inside errmsg reported by mongo to determine the correct error and showing propper message
            if (err.errmsg.toString().includes("dni"))
                msj = "Dni de Cliente";
           
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

function editarCliente(req, res) {
    Cliente.findById(req.params.idCliente, function (err, cliente) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!cliente) {
            return res.status(404).json({
                title: 'Error',
                error: 'Cliente no encontrado'
            });
        }

        cliente.dni= req.body.dniCliente,
        cliente.nombre=req.body.nombreCliente,
        cliente.apellido= req.body.apellidoCliente,
        cliente.telefono= req.body.telefonoCliente,
        cliente.email= req.body.emailCliente,
        cliente.foto= req.body.fotoCliente,

        cliente.save().then(function (cliente) {
            res.status(200).json({
                message: 'Success',
                obj: cliente
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarCliente(req, res){
    Cliente.findOne({'_id': req.params.idCliente})
    .exec(function (err, cliente) {
        if (cliente) {
            cliente.remove().then(function (clienteEliminado) {
                return res.status(200).json({
                    message: 'Cliente eliminado correctamente',
                    obj: clienteEliminado
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
    getClientes,
    cargarCliente,
    editarCliente,
    eliminarCliente
}

