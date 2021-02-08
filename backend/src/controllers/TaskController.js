//@ts-check
const database = require('../database/connection')
const CryptoJs = require('crypto-js')

const encryptWithAES = text => {
    const passpharase = '123';
    return CryptoJs.AES.encrypt(text, passpharase).toString();
};

const dadoDecriptado = ciphertext => {
    const passpharase = '123';
    const bytes = CryptoJs.AES.decrypt(ciphertext, passpharase);
    const originalText = bytes.toString(CryptoJs.enc.Utf8);
    return originalText;
}

class TaskController {
    novaTarefa(request, response) {
        const { tarefa, descricao, responsavel } = request.body;
        console.log(tarefa, descricao, responsavel)
        const novaTarefa = {
            tarefa: encryptWithAES(tarefa),
            descricao: descricao,
            responsavel: responsavel
        }

        database.insert(novaTarefa).table("tasks").then(data => {
            console.log(data)
            response.json({ message: "Tarefa criada com sucesso!" })
        }).catch(erro => {
            console.log(erro)
        })
    }

    listarTarefas(request, response) {
        const id = request.params
        // const dadoEncriptado = encryptWithAES ('vanessa')
        // const dadoDecriptado = descryptWithAES (dadoEncriptado)
        // console.log(dadoEncriptado,dadoDecriptado)

        // const listarTarefas = {
        //     tarefas      : descryptWithAES(tarefas),
        //     descricao   : descricao,
        //     responsavel : responsavel
        // }

        database.select("*").table("tasks").then(tarefas => {
            console.log(tarefas)
            const tarefasDescriptada = tarefas.map(d => {
                const tarefaDescriptada = {
                    id         : d.id,
                    tarefa     : dadoDecriptado(d.tarefa),
                    descricao  : d.descricao,
                    responsavel: d.responsavel,
                }

                console.log(tarefaDescriptada);
                return tarefaDescriptada;
            })
            response.json(tarefasDescriptada)
        }).catch(error => {
            console.log(error)
        })
    }

    listarUmaTarefa(request, response) {
        const id = request.params;

        database.select("*").table("tasks").where({ id: id }).then(tarefa => {
            response.json(tarefa)

        }).catch(error => {
            console.log(error)
        })


    }

    atualizarTarefa(request, response) {
        const id = request.params.id;
        console.log(request.body.tarefa);
        const { tarefa } = request.body;

        database.where({ id: id }).update({ tarefa: tarefa }).table("tasks").then(data => {
            response.json({ message: "Tarefa atualizada com sucesso" })
        }).catch(error => {
            response.json(error)
        })
    }

    removerTarefa(request, response) {
        const id = request.params.id

        database.where({ id: id }).del().table("tasks").then(data => {
            response.json({ message: "Tarefa removida com sucesso" })
        }).catch(error => {
            response.json(error)
        })
    }
}

module.exports = new TaskController()