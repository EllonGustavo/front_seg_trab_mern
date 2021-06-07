import React from 'react'

import Container from 'react-bootstrap/Container'

import Corpo from '../components/Corpo'
import Cabecalho from '../components/Cabecalho'

const Inicio = () => {

    /*async function obtemItems(){
        let URL = `${BACKEND}/items`
        await fetch(URL)
        .then(res=>res.json())
        .then(data=>{
            setItems(data)
            console.log(items)
        })
        .catch(function erro(e){
            console.error(`Erro ao obter os items: ${e.message}`)
        })
    }*/

    return (
        <>
            <Container fluid className="p-0">
                <Cabecalho />
                <Corpo/>
            </Container>
        </>
    )
}

export default Inicio