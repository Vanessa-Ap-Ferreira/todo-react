const database = require('../database/connection')

class TaskController {
    novaTarefa(request,response){
        const {tarefa, descricao, responsavel} = request.body

        console.log(tarefa, descricao, responsavel)

        database.insert({tarefa,descricao,responsavel}).table("tasks").then(data=>{
            console.log(data)
            response.json({message:"Tarefa criada com sucesso!"})
        }).catch(erro=>{
            console.log(error)
        })
    }

    listarTarefas(request,response){
        const id = request.params

        database.select("*").table("tasks").then(tarefas=>{
            console.log(tarefas)
            response.json(tarefas)
        }).catch(error=>{
            console.log(error)
        })
    }

    listarUmaTarefa(request,response){
        const id = request.params

        database.select("*").table("tasks").where({id:id}).then(tarefa=>{
            response.json(tarefa)

        }).catch(error=>{
            console.log(error)
        })
    }

    atualizarTarefa(request,response){
        const id = request.params
        const {descricao} = request.body

        database.where({id:id}).update({descricao:descricao}).table("tasks").then(data=>{
            response.json({message:"Tarefa atualizada com sucesso"})
        }).catch(error=>{
            response.json(error)
        })
    }

    removerTarefa(request,response){
        const id = request.params

        database.where({id:id}).del().table("tasks").then(data=>{
            response.json({message: "Tarefa removida com sucesso"})
        }).catch(error=>{
            response.json(error)
        })
    }
}

module.exports = new TaskController()