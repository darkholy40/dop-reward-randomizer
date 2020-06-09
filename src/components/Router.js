import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'
import ListRandomizer from '../pages/ListRandomizer'

function Routes() {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/dop-cmd-2020" component={ListRandomizer} />
            </Switch>
        </div>
    )
}

export default Routes