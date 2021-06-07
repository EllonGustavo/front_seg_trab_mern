import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Inicio from '../pages/Inicio'

export default function Rotas(){
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={Inicio} />
            </Switch>
        </HashRouter>
    )
}