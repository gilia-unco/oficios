'use strict'

var Pedido = require('../models/pedido');


//var Cliente = require('../models/cliente');
var CounterPedido = require('../models/counterPedido');
var Estado = require('../models/estado');
var Categoria= require('../models/categoria');


// FUNCIONES
function getPedidos(req, res) {
    Estado.findOne({
        'nombre': req.params.estado
    }, (error, estado) => {
        if (error) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!estado) {
            return res.status(400).json({
                title: 'Error',
                error: 'No se encontro estado'
            });
        }

        Pedido.find({
                'estadosPedido.estado': estado._id
            })
            .populate([{
                    path: 'cliente'
                },
                {
                    path: 'oficial'
                },
                {
                    path: 'estadosPedido.estado',
                    model: 'Estado'
                },
                {
                    path: 'categoria.nombre',
                    model: 'Categoria'
                }
            ])
            .exec(function (err, pedidos) {
                if (err) {
                    return res.status(400).json({
                        title: 'Error',
                        error: err
                    });
                }
                if (!pedidos) {
                    return res.status(404).json({
                        title: 'Error',
                        error: err
                    });
                }
                res.status(200).json({
                    message: 'Success',
                    obj: pedidos
                });
            });
    });
}

function getPedido(req, res) {
    console.log('hola');
    Pedido.findById(req.params.idPedido)
    .populate([{
                    path: 'cliente'
                },
                {
                    path: 'oficial'
                },                {
                    path: 'estadosPedido.estado',
                    model: 'Estado'
                }
            ])
            .exec(function (err, pedido) {
                if (err) {
                    return res.status(400).json({
                        title: 'Error',
                        error: err
                    });
                }
                if (!pedido) {
                    return res.status(404).json({
                        title: 'Error',
                        error: 'Pedido no encontrado'
                    });
                }
                res.status(200).json({
                    message: 'Success',
                    obj: pedido
                });
            });
}

function getEstados(req, res) {    
    Estado.find({})
    .exec(function (err, estados) {
        if (err) {
            return res.status(400).json({
                title: 'Error',
                error: err
            });
        }
        if (!estados) {
            return res.status(404).json({
                title: 'Error',
                error: 'Estados no encontrados'
            });
        }
        res.status(200).json({
            message: 'Success',
            obj: estados
        });
    });
}

function cargarPedido(req, res) {
    if (!req.body.fechaPedido) {
        return res.status(400).json({
            title: 'Error',
            error: 'No ingreso fecha'
        });
    }

    if (!req.body.idCliente) {
        return res.status(400).json({
            title: 'Error id Cliente',
            error: 'No ingreso cliente'
        });
    }   

    if (!req.body.idOficial) {
        return res.status(400).json({
            title: 'Error id Oficial',
            error: 'No ingreso oficial'
        });
    }

    Estado.find({})
        .exec((error, estados) => {
            if (error) {
                return res.status(400).json({
                    title: 'Error',
                    error: error
                });
            }
            if (!estados) {
                return res.status(400).json({
                    title: 'Error id Estado',
                    error: 'No encontro estados'
                });
            }

            var estadoPedido = {
                estado: estados[0]._id,
                fecha: req.body.fechaPedido
            }

            CounterPedido.findOne({})
                .exec((error, counterPedido) => {
                    if (error) {
                        return res.status(400).json({
                            title: 'Error',
                            error: error
                        });
                    }
                    if (!counterPedido) {
                        return res.status(400).json({
                            title: 'Error id Pedido',
                            error: 'No encontro contador pedido'
                        });
                    }

                    Categoria.findById(req.params.idCategoria)
                    .exec(function (err, categoria) {
                        if (err) {
                            return res.status(400).json({
                                title: 'Error',
                                error: err
                            });
                        }
                        if (!categoria) {
                            return res.status(404).json({
                                title: 'Error',
                                error: 'Categoria no encontrada'
                            });
                        
                        }
                        var nuevoPedido = new Pedido({
                            numero: counterPedido.contador,
                            fecha: req.body.fechaPedido,
                            cliente: req.body.idCliente,                        
                            oficial: req.body.idOficial
                        });
    
                        nuevoPedido.estadosPedido.push(estadoPedido);
                        nuevoPedido.categoria.push(categoria);
    
                        counterPedido.contador = counterPedido.contador + 1;
    
                        nuevoPedido.save().then(function (nuevoPedido) {
                            counterPedido.save().then((counterGuardado) => {
    
                                Pedido.populate(nuevoPedido, [{
                                        path: 'cliente'
                                    },
                                    {
                                        path: 'oficial'
                                    },                                
                                    {
                                        path: 'estadosPedido.estado'
                                    },
                                    {
                                        path: 'categoria.nombre'
                                    }
                                ], (error, nuevoPedidoExpandido) => {
                                    if (error) {
                                        return res.status(400).json({
                                            title: 'Error',
                                            error: err
                                        });
                                    }
                                    if (!nuevoPedidoExpandido) {
                                        return res.status(400).json({
                                            title: 'Error',
                                            error: 'No se pudo expandir pedido creado'
                                        });
                                    }
                                    res.status(201).json({
                                        message: 'Pedido creado',
                                        obj: nuevoPedidoExpandido
                                    });
                                })
                            })
                        }, function (err) {
                            return res.status(404).json({
                                title: 'Error',
                                error: err
                            });
                        });




                        res.status(200).json({
                            message: 'Success',
                            obj: categoria
                        });
                    });

                    
                });
        });
}
function editarPedido(req, res) {
    Pedido.findById(req.params.idPedido, function (err, pedido) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!pedido) {
            return res.status(404).json({
                title: 'Error',
                error: 'Pedido no encontrado'
            });
        }

        if (req.body.oficial) {
            pedido.oficial = req.body.oficial; 
        }
        
       
        
        pedido.save().then(function (pedidoEditado) {
            Pedido.populate(pedidoEditado,[{
                path: 'cliente'
            },
            {
                path: 'oficial'
            },
           
            {
                path: 'estadosPedido.estado'
            }
        ], (error, pedidoEditadoExpandido) => {
                res.status(200).json({
                    message: 'Success',
                    obj: pedidoEditadoExpandido
                });
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}

function eliminarPedido(req, res) {
    Pedido.findOne({
            '_id': req.params.idPedido
        })
        .exec(function (err, pedido) {
            if (pedido) {
                pedido.remove().then(function (pedidoEliminado) {
                    return res.status(200).json({
                        message: 'pedido eliminado correctamente',
                        obj: pedidoEliminado
                    });
                }, function (err) {
                    return res.status(400).json({
                        title: 'Error',
                        error: err.message
                    });
                });
            } else {
                return res.status(404).json({
                    title: 'Error',
                    error: err.message
                });
            }
        });

}

//Cargar un Oficial

function cargarOficial(req, res) {
    //Asocio el oficial al pedido
    Pedido.findById(req.params.idPedido, function (err, pedido) {
        if (err) {
            return res.status(400).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!pedido) {
            return res.status(404).json({
                title: 'Error',
                error: 'Pedido no encontrado'
            });
        }

        pedido.oficial = req.params.idOficial;
        pedido.save().then(function (pedido) {
            res.status(200).json({
                message: 'Success',
                obj: pedido
            });
        }, function (err) {
            return res.status(404).json({
                title: 'Error',
                error: err
            });
        });
    });
}





// EXPORT
module.exports = {
    getPedidos,
    getPedido,
    getEstados,
    cargarPedido,
    editarPedido,
    eliminarPedido,
    cargarOficial
}