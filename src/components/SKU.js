import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Label, Table, Icon, Card, Button, Modal, Form, Dropdown, Pagination} from 'semantic-ui-react';

class SKU extends Component{
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      modalRincian : false,
      modalTambahSKU : false,
      modalAmbilSKU : false,
      fields : {},
      errors : {},
      activePage : 1,
      sku : {
        sku : '0',
        listGudang : []
      }
    }
  }

  toggleModal = (e) => this.setState({modalRincian:!this.state.modalRincian})
  toggleModalTambahSKU = (e) => this.setState({modalTambahSKU:!this.state.modalTambahSKU, fields: { id_gudang : this.gudangOptions[0].value, sku : '', stok: ''}, errors : {}})
  toggleModalAmbilSKU = (e) => this.setState({modalAmbilSKU:!this.state.modalAmbilSKU, fields: { id_gudang : this.gudangOptions[0].value, sku : this.skuOptions[0].value, stok: ''}, errors : {}})

  handleChange(field, e){
    let fields = this.state.fields;
    let errors = this.state.errors;
    fields[field] = e.target.value;
    errors[field] = undefined;
    this.setState({fields, errors});
  }

  handleValidationSKU = () => {
    let fields = this.state.fields
    let errors = {}
    let formIsValid = true
    //Id Gudang
    if(!fields["sku"]){
      formIsValid = false;
      errors["sku"] = "Tidak Boleh Kosong"
    }

    //Kapasitas Maksimal
    if(!fields["stok"]){
      formIsValid = false
      errors["stok"] = "Tidak Boleh Kosong"
    }else{
      let indexGudang = this.props.data.findIndex(element => element.id_gudang === fields.id_gudang )
      if(parseInt(fields["stok"])<1){
        formIsValid = false;
        errors["stok"] = "Stok 1"
      }
      else if(parseInt(fields["stok"])>this.props.data[indexGudang].tersisa){
        formIsValid = false;
        errors["stok"] = "Kapasitas tersisa gudang " + this.props.data[indexGudang].tersisa.toString() + ", silahkan memilih gudang lainnya atau mengurangi stok"
      }
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  handleValidationAmbilSKU = () => {
    let fields = this.state.fields
    let errors = {}
    let formIsValid = true

    //Stok
    if(!fields["stok"]){
      formIsValid = false
      errors["stok"] = "Tidak Boleh Kosong"
    }else{
      let indexSKU = this.data().findIndex(element => element.sku === fields.sku )
      let indexGudang = this.data()[indexSKU].list_gudang.findIndex(element => element.id_gudang === fields.id_gudang )
      if(parseInt(fields["stok"])<1){
        formIsValid = false;
        errors["stok"] = "Stok 1"
      }
      else if(indexGudang<0){
        formIsValid = false;
        errors["id_gudang"] = "Gudang yang anda pilih tidak memiliki stok "+ fields['sku'] +", silahkan pilih gudang lainnya"
      }
      else if(parseInt(fields["stok"])>this.data()[indexSKU].list_gudang[indexGudang].stok){
        formIsValid = false;
        errors["stok"] = "Stok "+ fields["sku"]+" pada gudang "+ fields['id_gudang'] +" hanya " + this.data()[indexSKU].list_gudang[indexGudang].stok.toString() + ", silahkan memilih gudang lainnya atau mengurangi stok"
      }
    }

    this.setState({errors: errors});
    return formIsValid;
  }


  SKUTambahSubmit = () => {
    // e.preventDefault();

    if(this.handleValidationSKU()){
      let data =   {
        id_gudang      : this.state.fields.id_gudang,
        stok           : this.state.fields.stok,
        sku            : this.state.fields.sku
      }
      this.setState({
        fields            : {},
        errors            : {},
        modalTambahSKU    : false
      })
      this.props.addStok(data);
    }
  }
  SKUAmbilSubmit = () => {
    // e.preventDefault();

    if(this.handleValidationAmbilSKU()){
      let data =   {
        id_gudang      : this.state.fields.id_gudang,
        stok           : this.state.fields.stok,
        sku            : this.state.fields.sku
      }
      this.setState({
        fields            : {},
        errors            : {},
        modalAmbilSKU     : false
      })
      this.props.ambilStok(data);
    }
  }

  data = () => {
    let listSKU = []
    let grupSKU = []
    // eslint-disable-next-line array-callback-return
    this.props.data.map(gudang => {
      // eslint-disable-next-line array-callback-return
      gudang.isi_gudang.map(sku => {
        if(grupSKU.includes(sku.sku)){
          let indexEl = listSKU.findIndex(element => element.sku === sku.sku )
          let tempArray = [...listSKU]
          tempArray[indexEl] = {...tempArray[indexEl], stok: tempArray[indexEl].stok + sku.stok}
          tempArray[indexEl] = {...tempArray[indexEl], list_gudang: [...tempArray[indexEl].list_gudang, { id_gudang : gudang.id_gudang, stok : sku.stok }]}
          listSKU = [...tempArray]
        }
        else{
          listSKU.push({...sku, list_gudang: [{ id_gudang : gudang.id_gudang, stok : sku.stok }]})
          grupSKU.push(sku.sku)
        }
      })
    })
    return listSKU
  }

  gudangOptions = this.props.data.map((gudang) => ({
    key: gudang.id_gudang,
    text: gudang.id_gudang,
    value: gudang.id_gudang,
  }))

  skuOptions = this.data().map((sku) => ({
    key: sku.sku,
    text: sku.sku,
    value: sku.sku,
  }))

  render() {
    const {sku, modalRincian, errors, fields, modalTambahSKU, modalAmbilSKU, activePage} = this.state
    return (
        <Card fluid color='teal' link>
          <Card.Content>
            <Card.Header textAlign='center'>Stok SKU</Card.Header>
          </Card.Content>
          <Card.Content>

            <Button basic color='teal' onClick={this.toggleModalTambahSKU}>
              Tambah Stok SKU
            </Button>
            <Button basic color='red' onClick={this.toggleModalAmbilSKU}>
              Ambil Stok SKU
            </Button>

            <Table color='teal' selectable singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width='3'>SKU</Table.HeaderCell>
                  <Table.HeaderCell width='1'>Stok</Table.HeaderCell>
                  <Table.HeaderCell width='1'>Aksi</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {
                  this.data().slice(5*(activePage-1),5*(activePage-1)+5).map((e, index)=>
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Label ribbon color='teal'>{e.sku}</Label>
                      </Table.Cell>
                      <Table.Cell>{e.stok}</Table.Cell>
                      <Table.Cell>
                        <Button basic color='teal' onClick={()=>{
                          this.toggleModal()
                          this.setState({
                            sku : {
                              sku : e.sku,
                              listGudang : [...e.list_gudang]
                            }
                          })
                        }}>
                          Rincian
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  )
                }
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan='3'>
                    <Pagination color='teal' floated='right'
                                boundaryRange={0}
                                defaultActivePage={1}
                                ellipsisItem={null}
                                firstItem={null}
                                lastItem={null}
                                siblingRange={1}
                                totalPages={this.data().length/5} onPageChange={(e, {activePage})=>{
                      this.setState({
                        activePage : activePage
                      })
                    }}/>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Card.Content>
          <Modal
            size='tiny'
            open={modalRincian}
          >
            <Modal.Header>Rincian {sku.sku}</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width='1'>Gudang</Table.HeaderCell>
                      <Table.HeaderCell width='1'>Stok</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {
                      sku.listGudang.map((gudang, index)=>
                        <Table.Row key={index}>
                          <Table.Cell>
                            {gudang.id_gudang}
                          </Table.Cell>
                          <Table.Cell>
                            {gudang.stok}
                          </Table.Cell>
                        </Table.Row>
                      )
                    }
                  </Table.Body>
                </Table>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.toggleModal}>
                <Icon name='remove' /> Tutup
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            open={modalTambahSKU}
            size='tiny'
          >
            <Modal.Header>Tambah Stok SKU</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form>
                  <Form.Field>
                    <Form.Input
                      label='SKU'
                      placeholder='SKU'
                      onChange={this.handleChange.bind(this, "sku")}
                      error={errors['sku'] !== undefined ? { content: errors['sku'] } : false}
                      value={fields["sku"]} />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      label='Stok'
                      min='1'
                      type='number'
                      placeholder='Stok'
                      onChange={this.handleChange.bind(this, "stok")}
                      error={ errors['stok'] !== undefined ? { content: errors['stok'] } : false}
                      value={fields["stok"]} />
                  </Form.Field>
                  <Form.Field>
                    <label>Nomor Gudang</label>
                    <Dropdown placeholder='Nomor Gudang' error={errors['id_gudang'] !== undefined} search selection options={this.gudangOptions} defaultValue={this.gudangOptions[0].value} onChange={(e, {value}) => {
                      let fields = this.state.fields
                      let errors = this.state.errors
                      fields['id_gudang'] = value
                      errors['id_gudang'] = undefined
                      this.setState({fields,errors})
                    }}/>
                    {
                      errors['id_gudang'] !== undefined ? (
                        <Label basic color='red' pointing>
                          {errors['id_gudang']}
                        </Label>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )
                    }
                  </Form.Field>
                </Form>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.toggleModalTambahSKU}>
                <Icon name='remove' /> Batal
              </Button>
              <Button color='teal' onClick={this.SKUTambahSubmit}>
                <Icon name='checkmark' /> Tambah
              </Button>
            </Modal.Actions>
          </Modal>
          <Modal
            open={modalAmbilSKU}
            size='tiny'
          >
            <Modal.Header>Ambil Stok SKU</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form>
                  <Form.Field>
                    <label>SKU</label>
                    <Dropdown placeholder='SKU' error={errors['sku'] !== undefined} search selection options={this.skuOptions} defaultValue={this.skuOptions[0].value} onChange={(e, { value }) => {
                      let fields = this.state.fields
                      let errors = this.state.errors
                      fields['sku'] = value
                      errors['sku'] = undefined
                      this.setState({fields,errors})
                    }}/>
                    {
                      errors['sku'] !== undefined ? (
                        <Label basic color='red' pointing>
                          {errors['sku']}
                        </Label>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )
                    }
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      label='Stok'
                      min='1'
                      type='number'
                      placeholder='Stok'
                      onChange={this.handleChange.bind(this, "stok")}
                      error={ errors['stok'] !== undefined ? { content: errors['stok'] } : false}
                      value={fields["stok"]} />
                  </Form.Field>
                  <Form.Field>
                    <label>Nomor Gudang</label>
                    <Dropdown placeholder='Nomor Gudang' error={errors['id_gudang'] !== undefined} search selection options={this.gudangOptions} defaultValue={this.gudangOptions[0].value} onChange={(e, { value }) => {
                      let fields = this.state.fields
                      let errors = this.state.errors
                      fields['id_gudang'] = value
                      errors['id_gudang'] = undefined
                      this.setState({fields,errors})
                    }}/>
                    {
                      errors['id_gudang'] !== undefined ? (
                        <Label basic color='red' pointing>
                          {errors['id_gudang']}
                        </Label>
                      ) : (
                        <React.Fragment></React.Fragment>
                      )
                    }
                  </Form.Field>
                </Form>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.toggleModalAmbilSKU}>
                <Icon name='remove' /> Batal
              </Button>
              <Button color='teal' onClick={this.SKUAmbilSubmit}>
                <Icon name='checkmark' /> Ambil
              </Button>
            </Modal.Actions>
          </Modal>
        </Card>
    );
  }
}

export default SKU;
