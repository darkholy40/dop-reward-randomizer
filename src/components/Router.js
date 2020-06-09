import React from 'react'
import { Switch, Route } from 'react-router-dom'

import ListRandomizer from '../pages/ListRandomizer'

function Routes() {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={ListRandomizer} />
                <Route path="/*" component={ListRandomizer} />
            </Switch>
        </div>
    )
}

export default Routes