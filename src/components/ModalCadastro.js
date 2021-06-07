import React, { useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Toast from 'react-bootstrap/Toast'

import { BACKEND } from '../constants'

const ModalCadastro = (props) => {

    const valorInicialCategoria = {
        nome: '',
        status: true
    }

    const valorInicialItem = {
        nome: '',
        status: '',
        quantidade: 0,
        categoria: '',
        preco: 0
    }

    const { mostrar, titulo } = props

    const [categoria, setCategoria] = useState(valorInicialCategoria)
    const { nome, status } = categoria
    const [categorias, setCategorias] = useState([])
    const [errosCategoria, setErrosCategoria] = useState({})

    const [item, setItem] = useState(valorInicialItem)
    const [errosItem, setErrosItem] = useState({})

    const [dropdownNomeCat, setDropdownNomeCat] = useState('Selecione uma categoria')
    const [aviso, setAviso] = useState('')

    const token = localStorage.getItem('access_token')

    useEffect(() => {
        obtemCategorias()
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

    async function salvarCategoria() {
        const novosErros = validaErrosCategoria()
        if (Object.keys(novosErros).length > 0) {
            setErrosCategoria(novosErros)
        }
        else {
            let URL = `${BACKEND}/categorias`
            categoria.status = (categoria.status === true || categoria.status === 'ativo') ? 'ativo' : 'inativo'

            await fetch(URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            })
                .then(res => res.json())
                .then(data => {
                    (data._id || data.message) ? setAviso('Registro salvo') : setAviso('')

                    setCategoria(valorInicialCategoria)
                })
                .catch(function (erro) {
                    console.error(`Erro ao salvar a categoria: ${erro.message}`)
                })
        }
    }

    async function salvarItem() {
        const novosErros = validaErrosItem()
        if (Object.keys(novosErros).length > 0) {
            setErrosItem(novosErros)
        }
        else {
            let URL = `${BACKEND}/items`
            item.status=(item.quantidade>0)? 'disponivel':'indisponivel'

            await fetch(URL, {
                mode:'cors',
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'access-token': token
                },
                body: JSON.stringify(item)
            })
                .then(res => res.json())
                .then(data => {
                    (data._id || data.message) ? setAviso('Registro salvo') : setAviso('')

                    setItem(valorInicialItem)
                })
                .catch(function (erro) {
                    console.error(`Erro ao salvar a categoria: ${erro.message}`)
                })
        }
    }

    const validaErrosCategoria = () => {
        const novosErrosCategoria = {}

        if (!nome || nome === '') novosErrosCategoria.nome = 'O nome não pode ser vazio'
        else if (nome.length > 20) novosErrosCategoria.nome = 'O nome deve ser menor que 20'
        else if (nome.length < 3) novosErrosCategoria.nome = 'O nome deve ser maior que 3'

        return novosErrosCategoria
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
        <Modal
            animation={false}
            show={mostrar}
            onHide={() => {
                props.setMostrar(!mostrar)
                setCategoria(valorInicialCategoria)
                setItem(valorInicialItem)
            }}>
            <Modal.Header>
                <Modal.Title>Cadastro de {titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {titulo === 'Categorias' ?
                    <Form>
                        <Form.Label>Nome da Categoria</Form.Label>
                        <Form.Control
                            name='nome'
                            placeholder='EX: Camisa'
                            value={nome}
                            isInvalid={!!errosCategoria.nome}
                            onChange={(e) => {
                                setCategoria({
                                    ...categoria,
                                    [e.target.name]:
                                        e.target.value
                                })
                                setErrosCategoria({})
                            }
                            }
                            type='text' />
                        <Form.Control.Feedback type='invalid'>
                            {errosCategoria.nome}
                        </Form.Control.Feedback>
                        <Form.Label>Status Ativo?</Form.Label>
                        <Form.Check
                            type='checkbox'
                            label='Ativo'
                            name='catStatus'
                            checked={status}
                            onChange={(e) => setCategoria({
                                ...categoria,
                                [e.target.name]:
                                    e.target.checked
                            })
                            } />
                        <Button
                            variant='danger'
                            style={{
                                margin: 10
                            }}
                            onClick={() => {
                                props.setMostrar(!mostrar)
                                setCategoria(valorInicialCategoria)
                            }}>
                            Cancelar
                        </Button>
                        <Button
                            variant='success'
                            style={{
                                margin: 10
                            }}
                            onClick={() => salvarCategoria()}>
                            Confirmar
                        </Button>
                    </Form>
                    :
                    <Form>
                        <Form.Label>Nome do item</Form.Label>
                        <Form.Control
                            name='nome'
                            type='text'
                            placeholder='EX: tenis adidas'
                            value={item.nome}
                            isInvalid={!!errosItem.nome}
                            onChange={(e) => {
                                setItem({
                                    ...item,
                                    [e.target.name]:
                                        e.target.value
                                })
                            }}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errosItem.nome}
                        </Form.Control.Feedback>
                        <br />
                        <DropdownButton
                            variant='secondary'
                            title={dropdownNomeCat}
                            id="cadastros">
                            {
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
                                    isInvalid={!!errosItem.quant}
                                    style={{
                                        width: 100
                                    }}
                                    onChange={(e) => {
                                        setItem({
                                            ...item,
                                            [e.target.name]:
                                                e.target.value
                                        })
                                    }} />
                                <Form.Control.Feedback type='invalid'>
                                    {errosItem.quant}
                                </Form.Control.Feedback>
                                    &nbsp;
                                    &nbsp;
                                <Form.Label>Preço: </Form.Label>
                                &nbsp;
                                <Form.Control
                                    name='preco'
                                    type='number'
                                    value={item.preco}
                                    isInvalid={!!errosItem.preco}
                                    style={{
                                        width: 100
                                    }}
                                    onChange={(e) => {
                                        setItem({
                                            ...item,
                                            [e.target.name]:
                                                e.target.value
                                        })
                                    }} />
                                <Form.Control.Feedback type='invalid'>
                                    {errosItem.preco}
                                </Form.Control.Feedback>
                            </Row>
                        </Col>
                        <Button
                            variant='danger'
                            style={{
                                margin: 10
                            }}
                            onClick={() => {
                                props.setMostrar(!mostrar)
                                setItem(valorInicialItem)
                                setDropdownNomeCat('Selecione uma categoria')
                            }}>
                            Cancelar
                        </Button>
                        <Button
                            variant='success'
                            style={{
                                margin: 10
                            }}
                            onClick={() => salvarItem()}>
                            Confirmar
                        </Button>
                    </Form>
                }
                <Toast
                    onClose={() => setAviso('')}
                    show={aviso.length > 0}
                    animation={false}
                    delay={4000}
                    autohide
                    className="bg-success"
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0
                    }}>
                    <Toast.Header>Aviso</Toast.Header>
                    <Toast.Body className="text-light">{aviso}</Toast.Body>
                </Toast>
            </Modal.Body>
        </Modal >
    )
}

export default ModalCadastro