import React, { useState } from 'react'

import ModalCadastro from '../components/ModalCadastro'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'

import { MdDelete, MdEdit } from 'react-icons/md'

import { FaStoreAlt } from "react-icons/fa";
import { BACKEND } from '../constants'


const Cabecalho = () => {

  const valorInicialCategoria = {
    nome: '',
    status: true
  }

  const [mostrar, setMostrar] = useState(false)
  const [titulo, setTitulo] = useState('')

  const [categorias, setCategorias] = useState()
  const [categoria, setCategoria] = useState(valorInicialCategoria)
  const [editCat, setEditCat] = useState(false)

  async function obterCategorias() {
    let URL = `${BACKEND}/categorias`
    await fetch(URL)
      .then(res => res.json())
      .then(data => {
        setCategorias(data)
      })
      .then(
        setEditCat(true),
      )
      .catch(function (erro) {
        console.error(`Erro ao obter as categorias: ${erro.message}`)
      })
  }

  async function deletaCategoria() {
    let URL = `${BACKEND}/categorias/${categoria.nome}`
    await fetch(URL, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(() => obterCategorias())
      .catch(function erro(e) {
        console.error(`Erro ao deletar o item: ${e.message}`)
      })
  }

  async function editarCategoria() {

    let URL = `${BACKEND}/items`
    await fetch(URL, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoria)
    })
      .then(res => res.json())
      .then(data => {
        setCategoria(valorInicialCategoria)
        obterCategorias()
      })
      .catch(function (erro) {
        console.error(`Erro ao editar o item: ${erro.message}`)
      })

  }

  return (
    <>
      <Navbar
        style={{ backgroundColor: '#303030' }}
        variant="dark">
        <Navbar.Brand
          href="#inicio">
          <FaStoreAlt /> Loja
      </Navbar.Brand>
        <Nav
          className="mr-auto">
          <DropdownButton
            style={{ marginLeft: 20 }}
            variant='secondary'
            as={ButtonGroup}
            menuAlign={{ lg: 'right' }}
            title="Cadastros"
            id="cadastros">
            <Dropdown.Item
              eventKey="1"
              onClick={() => {
                setTitulo('Categorias')
                setMostrar(!mostrar)
              }}> Categorias</Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              onClick={() => {
                setTitulo("Item")
                setMostrar(!mostrar)
              }} > Items</Dropdown.Item>
          </DropdownButton>
          <Button
            variant='secondary'
            style={{ marginLeft: 10 }}
            onClick={() => {
              obterCategorias()
            }}>
            Editar categorias
          </Button>
        </Nav>
      </Navbar>
      <ModalCadastro
        mostrar={mostrar}
        setMostrar={setMostrar}
        titulo={titulo}
      />
      {categorias &&
        <Modal
          show={editCat}
          animation={false}
          onHide={() => {
            setEditCat(false)
          }} >
          <Modal.Header>
            <Modal.Title>Editar Categorias</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Table striped bordered hover>
                <thead>
                  <tr className="bg-success text-dark">
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Opções</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    categorias.map(item => (
                      <tr key={item._id}>
                        <td>
                          <Form.Control
                            name='nome'
                            value={item.nome}
                            onChange={(e) => {
                              setCategoria({
                                ...categoria,
                                [e.target.name]:
                                  e.target.value
                              })
                            }} />
                        </td>
                        <td>
                          <Form.Check
                            type='checkbox'
                            label='Ativo'
                            name='status'
                            checked={item.status}
                            onChange={(e) =>
                              setCategoria({
                                ...categoria,
                                [e.target.name]:
                                  e.target.checked
                              })
                            } />
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setCategoria(item)
                              editarCategoria()
                            }}>
                            <MdEdit />
                          </Button>
                      &nbsp;
                       <Button
                            variant="outline-danger"
                            onClick={() => {
                              setCategoria(item)
                              deletaCategoria()
                            }} >
                            <MdDelete />
                          </Button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
              <Button
                variant='danger'
                onClick={() => {
                  setEditCat(false)
                }} >
                  Cancelar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      }
    </>
  )
}

export default Cabecalho