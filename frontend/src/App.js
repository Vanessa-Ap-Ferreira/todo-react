import React from 'react';
import logo from './logo.svg';
import './App.css';
import ListItems from './ListItems';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentItem: {
        text: '',
        key: '',
      }
    }
    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:4000/tarefas').then(response => response.json()).then(listaTarefas => {
      const novaLista = listaTarefas.map(tarefa => ({ text: tarefa.tarefa, key: tarefa.id }))
      this.setState({
        items: novaLista
      })
    })
  }

  handleInput(e) {
    this.setState({
      currentItem: {
        text: e.target.value,
        key: Date.now()
      }
    })
  }
  addItem(e) {
    e.preventDefault();

    const newItem = this.state.currentItem;

    fetch(`http://localhost:4000/novaTarefa/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tarefa: newItem.text, descricao: '', responsavel: '' })
    }).then(d => d.json()).then(d => {
      if (newItem.text !== "") {

        const items = [...this.state.items, newItem];
        this.setState({
          items: items,
          currentItem: {
            text: '',
            key: ''
          }
        })
      }
    })
  }

  deleteItem(key) {
    fetch(`http://localhost:4000/delete/tarefa/${key}`, {
      method: 'DELETE',
    }).then(d => d.json()).then(d => {


      const filteredItems = this.state.items.filter(item => item.key !== key);

      this.setState({
        items: filteredItems
      })
    })
  }


  setUpdate(text, key) {
    fetch(`http://localhost:4000/atualizar/tarefa/${key}` , {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tarefa: text, descricao: '', responsavel: '' })
    }).then(d => d.json()).then(d => {
      const items = this.state.items;
      items.map(item => {
        if (item.key === key) {
          item.text = text;
        }
      })
      this.setState({
        items: items
      })
    })
  }

  render() {
    return (
      <div className="App">
        <header>
          <form id="to-do-form" onSubmit={this.addItem}>
            <input type="text" placeholder="Insira tarefa"
              value={this.state.currentItem.text}
              onChange={this.handleInput} />
            <button type="submit">Adicionar</button>
          </form>
        </header>
        <ListItems items={this.state.items}
          deleteItem={this.deleteItem}
          setUpdate={this.setUpdate}></ListItems>
      </div>
    );
  }
}

export default App;
