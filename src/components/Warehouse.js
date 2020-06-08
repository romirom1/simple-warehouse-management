import React, {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Label, Table, Pagination, Icon, Button, Card, Modal, Form} from 'semantic-ui-react';

class Warehouse extends Component{
  constructor(props) {
    super(props);
    this.state = {
      modalTambahGudang : false,
      fields: {},
      errors: {},
      activePage : 1
    }
  }

  openModal = (e) => this.setState({
      modalTambahGudang : true
    })

  tutupModal = (e) => this.setState({
      fields : {},
      errors : {},
      modalTambahGudang : false
    })

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Id Gudang
    if(!fields["id_gudang"]){
      formIsValid = false;
      errors["id_gudang"] = "Tidak Boleh Kosong";
    }else{
      this.props.data.map(gudang => {
        if(gudang.id_gudang === fields["id_gudang"]){
          formIsValid = false;
          errors["id_gudang"] = "Nomor gudang sudah ada"
        }
      })
    }

    //Kapasitas Maksimal
    if(!fields["kapasitas_maks"]){
      formIsValid = false;
      errors["kapasitas_maks"] = "Tidak Boleh Kosong";
    }else{
      if(parseInt(fields["kapasitas_maks"])<1){
        formIsValid = false;
        errors["kapasitas_maks"] = "Kapasitas tidak boleh kurang dari 1";
      }
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  gudangSubmit = () => {
    // e.preventDefault();

    if(this.handleValidation()){
      let data =   {
        id_gudang      : this.state.fields.id_gudang,
        kapasitas_maks : this.state.fields.kapasitas_maks,
        terisi         : this.state.fields.kapasitas_maks,
        tersisa        : this.state.fields.kapasitas_maks,
        isi_gudang     : []
      }
      this.setState({
        fields            : {},
        errors            : {},
        modalTambahGudang : false
      })
      this.props.addGudang(data);
    }
  }

  handleChange(field, e){
    let fields = this.state.fields;
    let errors = this.state.errors;
    fields[field] = e.target.value;
    errors[field] = undefined;
    this.setState({fields, errors});
  }

  render() {
    const {data} = this.props
    const {modalTambahGudang, fields, errors, activePage} = this.state
    return (
        <Card fluid>
          <Card.Content>
            <Card.Header textAlign='center'>Warehouse</Card.Header>
          </Card.Content>
          <Card.Content>
            <Button basic color='teal' onClick={this.openModal}>Tambah Gudang</Button>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width='2'>Gudang</Table.HeaderCell>
                  <Table.HeaderCell width='1'>Kapasitas Maksimal</Table.HeaderCell>
                  <Table.HeaderCell width='1'>Terisi</Table.HeaderCell>
                  <Table.HeaderCell width='1'>Tersisa</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {
                  data.slice(5*(activePage-1),5*(activePage-1)+5).map((gudang, index)=>
                    <Table.Row key={index}>
                      <Table.Cell>
                        <Label ribbon>{gudang.id_gudang}</Label>
                      </Table.Cell>
                      <Table.Cell>{gudang.kapasitas_maks}</Table.Cell>
                      <Table.Cell>{gudang.terisi}</Table.Cell>
                      <Table.Cell>{gudang.tersisa}</Table.Cell>
                    </Table.Row>
                  )
                }
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan='4'>
                    <Pagination floated='right'
                                boundaryRange={0}
                                defaultActivePage={1}
                                ellipsisItem={null}
                                firstItem={null}
                                lastItem={null}
                                siblingRange={1}
                                totalPages={data.length/5} onPageChange={(e, {activePage})=>{
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
            open={modalTambahGudang}
            closeOnEscape={true}
            closeOnDimmerClick={false}
            size='tiny'
          >
            <Modal.Header>Tambah Gudang</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form>
                  <Form.Field>
                    <Form.Input
                      label='Nomor Gudang'
                      placeholder='Nomor Gudang'
                      onChange={this.handleChange.bind(this, "id_gudang")}
                      error={errors['id_gudang'] !== undefined ? { content: errors['id_gudang'] } : false}
                      value={fields["id_gudang"]} />
                  </Form.Field>
                  <Form.Field>
                    <Form.Input
                      label='Kapasitas Maksimal'
                      min='1'
                      type='number'
                      placeholder='Kapasitas Gudang'
                      onChange={this.handleChange.bind(this, "kapasitas_maks")}
                      error={ errors['kapasitas_maks'] !== undefined ? { content: errors['kapasitas_maks'] } : false}
                      value={fields["kapasitas_maks"]} />
                  </Form.Field>
                </Form>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.tutupModal}>
                <Icon name='remove' /> Batal
              </Button>
              <Button color='green' onClick={this.gudangSubmit}>
                <Icon name='checkmark' /> Tambah
              </Button>
            </Modal.Actions>
          </Modal>
        </Card>
    );
  }
}

export default Warehouse;
