const { request } = require("express");

const connection = require('../database/connection')
const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/TaskController')
const jwt = require('jsonwebtoken')

router.post('/login', (req, res, next) => {
    console.log(req.body)
    if (req.body.user === 'vanessa' && req.body.password === '123') {
        const id = 1;
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300
        });
        return res.json({ auth: true, token: token });
    }

    res.status(500).json({ message: 'Login inválido' });
})

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'O token não foi encontrado.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Falha para se authenticar, Token invalido ou vencido.' });

        req.userId = decoded.id;
        next();
    });
}

router.get('/clientes', verifyJWT, (req, res, next) => {
    console.log("retornou clientes");
    res.json([{id:1,nome:'vanessa'}]);
})


router.post('/novaTarefa', TaskController.novaTarefa)

router.get('/tarefas', TaskController.listarTarefas)

router.get('/tarefa/:id', TaskController.listarUmaTarefa)

router.put('/atualizar/tarefa/:id', TaskController.atualizarTarefa)

router.delete('/delete/tarefa/:id', TaskController.removerTarefa)

router.post('/logout', function (req, res) {
    res.json({ auth: false, token: null })
})

module.exports = router