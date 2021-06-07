import React, { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { MdDelete, MdEdit } from 'react-icons/md'

import { BACKEND } from '../constants'

const Corpo = () => {

    const valorInicialItem = {
        nome: '',
        status: '',
        quantidade: 0,
        categoria: '',
        preco: 0
    }

    const [items, setItems] = useState([])
    const [item, setItem] = useState(valorInicialItem)

    const [categorias, setCategorias]=useState()

    const [dropdownNomeCat, setDropdownNomeCat] = useState('Selecione uma categoria')
    const [mostrar, setMostrar] = useState(false)
    const [mostrarEdit, setMostrarEdit] = useState(false)
    const [erros, setErros] = useState({})

    useEffect(() => {
        document.title = 'Inicio'
        let URL = `${BACKEND}/items`
        fetch(URL)
            .then(res => res.json())
            .then(data => {
                setItems(data)
            })
            .catch(function erro(e) {
                console.error(`Erro ao obter os items: ${e.message}`)
            })
    }, [])

    async function obtemCategorias() {
        let URL = `${BACKEND}/categorias`
        await fetch(URL)
            .then(res => res.json())
            .then(data => {
                setCategorias(data)
            })
            .catch(function erro(e) {
                console.error(`Erro ao obter as categorias: ${e.message}`)
            })
    }

    async function obterItems() {
        let URL = `${BACKEND}/items`
        fetch(URL)
            .then(res => res.json())
            .then(data => {
                setItems(data)
            })
            .catch(function erro(e) {
                console.error(`Erro ao obter os items: ${e.message}`)
            })
    }

    async function deletaItem() {
        let URL = `${BACKEND}/items/${item._id}`
        await fetch(URL, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(() => obterItems())
            .catch(function erro(e) {
                console.error(`Erro ao deletar o item: ${e.message}`)
            })
    }

    async function editaItem(){
        let novosErros = validaErrosItem()
        if(Object.keys(novosErros).length>0){
            setErros(novosErros)
        }
        else{
            let URL = `${BACKEND}/items`
            await fetch(URL,{
                method:'PUT',
                headers:{
                    Accept:'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
            .then(res=>res.json())
            .then(data=>{
                setItem(valorInicialItem)
                obterItems()
            })
            .catch(function(erro){
                console.error(`Erro ao editar o item: ${erro.message}`)
            })
            setMostrarEdit(false)
        }
    }

    const validaErrosItem = () => {
        const novosErrosItem = {}
        if (!item.nome || item.nome === '') novosErrosItem.nome = 'O nome não pode ser vazio'
        else if (item.nome.length > 30) novosErrosItem.nome = 'O nome deve ser menor que 30'
        else if (item.nome.length < 3) novosErrosItem.nome = 'O nome deve ser maior que 3'

        if (item.quantidade < 0 || item.quantidade === null) novosErrosItem.quant = 'A quantidade deve ser maior ou igual há 0'
        if (item.preco <= 0 || item.preco === null) novosErrosItem.preco = 'O preço deve ser maior que 0'

        return novosErrosItem
    }

    return (
        <>{items &&
            items.map(item => (
                <Container key={item._id}>
                    <Card>
                        <Card.Body
                            style={{ textAlign: 'center' }} >
                            <Card.Title>{item.nome}
                            </Card.Title>
                            <Card.Text>
                                Em estoque: {item.quantidade}
                                &nbsp;
                                preço: R${item.preco}
                            </Card.Text>
                            <Button
                                style={{ margin: 10 }}
                                variant='danger'
                                onClick={() => {
                                    setMostrar(true)
                                    setItem(item)
                                }}
                            ><MdDelete /></Button>
                            <Button
                                style={{ margin: 10 }} variant='outline-primary'
                                onClick={() => {
                                    setMostrarEdit(true)
                                    setItem(item)
                                    obtemCategorias()
                                }}
                            ><MdEdit /> </Button>
                        </Card.Body>
                    </Card>

                </Container>
            ))
        }
            <Modal
                show={mostrar}
                animation={false}
                onHide={() => setMostrar(false)} >
                <Modal.Header>
                    <Modal.Title>Atenção</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja realmente deletar o item selecionado?</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='danger'
                        onClick={() => {
                            setMostrar(false)
                            setItem(null)
                        }}>
                        Cancelar
                    </Button>
                    <Button
                        variant='success'
                        onClick={() => {
                            deletaItem()
                            setMostrar(false)
                        }}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            {item &&
                <Modal
                    show={mostrarEdit}
                    animation={false}
                    onHide={() => {
                        setMostrarEdit(false)
                    }}>
                    <Modal.Header>
                        <Modal.Title>Editando item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label>Nome do item</Form.Label>
                            <Form.Control
                                name='nome'
                                type='text'
                                value={item.nome}
                                isInvalid={!!erros.nome}
                                onChange={(e) => {
                                    setItem({
                                        ...item,
                                        [e.target.name]:
                                            e.target.value
                                    })
                                }}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {erros.nome}
                            </Form.Control.Feedback>
                            <br />
                            <DropdownButton
                                variant='secondary'
                                title={dropdownNomeCat}
                                id="cadastros">
                                {categorias&&
                                    categorias.map(itemCat => (
                                        <Dropdown.Item
                                            key={itemCat._id}
                                            name={'categoria'}
                                            value={itemCat._id}
                                            onClick={(e) => {
                                                setDropdownNomeCat(itemCat.nome)
                                            }}
                                            eventKey={itemCat._id}
                                        >{itemCat.nome}</Dropdown.Item>
                                    ))
                                }
                            </DropdownButton>
                            <br />
                            <Col>
                                <Row>
                                    <Form.Label>Quantidade: </Form.Label>
                                &nbsp;
                                <Form.Control
                                        name='quantidade'
                                        type='number'
                                        value={item.quantidade}
                                        isInvalid={!!erros.quant}
                                        onChange={(e) => {
                                            setItem({
                                                ...item,
                                                [e.target.name]:
                                                    e.target.value
                                            })
                                        }} />
                                    <Form.Control.Feedback type='invalid'>
                                        {erros.quant}
                                    </Form.Control.Feedback>
                                    &nbsp;
                                    &nbsp;
                                <Form.Label>Preço: </Form.Label>
                                &nbsp;
                                <Form.Control
                                        name='preco'
                                        type='number'
                                        value={item.preco}
                                        isInvalid={!!erros.preco}
                                        onChange={(e) => {
                                            setItem({
                                                ...item,
                                                [e.target.name]:
                                                    e.target.value
                                            })
                                        }} />
                                    <Form.Control.Feedback type='invalid'>
                                        {erros.preco}
                                    </Form.Control.Feedback>
                                </Row>
                            </Col>
                            <Button
                                variant='danger'
                                style={{ margin: 10 }}
                                onClick={() => {
                                    setMostrarEdit(false)
                                }} >
                                Cancelar
                        </Button>
                            <Button
                                variant='success'
                                style={{ margin: 10 }}
                                onClick={() => {
                                    editaItem()
                                }} >
                                Confirmar
                        </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default Corpo