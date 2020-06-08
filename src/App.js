import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import Warehouse from "./components/Warehouse";
import SKU from "./components/SKU";
import database from "./resources/database";
import {Container, Header, Menu} from 'semantic-ui-react';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      'activeItem' : window.location.pathname === '/' ? 'home' : window.location.pathname.slice(1),
      'data'       : Object.assign(database)
    }
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  saveLocal(data){
    localStorage.setItem("data_warehouse", JSON.stringify(data))
  }

  addGudang = (gudangBaru) => {
    this.saveLocal([...this.state.data, gudangBaru])
    this.setState({
      'data' : [...this.state.data, gudangBaru]
    })
  }

  addStok = (stokBaru) => {
    let indexGudang = this.state.data.findIndex(element => element.id_gudang === stokBaru.id_gudang )
    let indexSKU = this.state.data[indexGudang].isi_gudang.findIndex(element => element.sku === stokBaru.sku )
    let tempArray = [...this.state.data]
    if(indexSKU<0)
      tempArray[indexGudang].isi_gudang = [...tempArray[indexGudang].isi_gudang, {sku : stokBaru.sku, stok : parseInt(stokBaru.stok)}]
    else
      tempArray[indexGudang].isi_gudang[indexSKU].stok += parseInt(stokBaru.stok)
    tempArray[indexGudang].terisi += parseInt(stokBaru.stok)
    tempArray[indexGudang].tersisa -= parseInt(stokBaru.stok)

    this.saveLocal([...tempArray])
    this.setState({
      'data' : [...tempArray]
    },)
  }

  ambilStok = (stokAmbil) => {
    let indexGudang = this.state.data.findIndex(element => element.id_gudang === stokAmbil.id_gudang )
    let indexSKU = this.state.data[indexGudang].isi_gudang.findIndex(element => element.sku === stokAmbil.sku )
    let tempArray = [...this.state.data]
    if(tempArray[indexGudang].isi_gudang[indexSKU].stok === parseInt(stokAmbil.stok))
      tempArray[indexGudang].isi_gudang.splice(indexSKU,1)
    else
      tempArray[indexGudang].isi_gudang[indexSKU].stok -= parseInt(stokAmbil.stok)
    tempArray[indexGudang].terisi -= parseInt(stokAmbil.stok)
    tempArray[indexGudang].tersisa += parseInt(stokAmbil.stok)

    this.saveLocal([...tempArray])
    this.setState({
      'data' : [...tempArray]
    })
  }

  render() {
    const { activeItem, data } = this.state
    return (
      <Router>
          <Container>
            <Menu pointing secondary>
              <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={this.handleItemClick}
                as={Link}
                to={'/'}
              />
              <Menu.Item
                name='warehouse'
                active={activeItem === 'warehouse'}
                onClick={this.handleItemClick}
                as={Link}
                to={'/warehouse'}
              />
              <Menu.Item
                name='sku'
                active={activeItem === 'sku'}
                onClick={this.handleItemClick}
                as={Link}
                to={'/sku'}
              />
            </Menu>

            <Header as='h1' icon textAlign='center'>
              Simple Warehouse Management
            </Header>

            <Switch>
              <Route path="/warehouse">
                <Warehouse data={data} addGudang={this.addGudang} />
              </Route>
              <Route path="/sku">
                <SKU data={data} addStok={this.addStok} ambilStok={this.ambilStok}/>
              </Route>
              <Route path="/">
                <Header as='h3' textAlign='center'>
                  Dibuat oleh Romadlon Rahmatulloh
                </Header>
              </Route>
            </Switch>

          </Container>
      </Router>
    );
  }
}

export default App;
