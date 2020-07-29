import React from 'react'

import classes from './BuildControls.css'
import BuildControl from './BuildControl/BuildControl'

const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Bacon', type: 'bacon'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'},
];

const buildControls = (props) => (
    // за всеки бутон в контролите (масива) генерираме компонент с key и label
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)} $</strong></p>
        {controls.map(ctrl => (
            <BuildControl 
                key={ctrl.label} 
                label={ctrl.label}
                moreBtn={() => props.ingredientAdded(ctrl.type)}
                lessBtn={() => props.ingredientRemoved(ctrl.type)}
                disabled={props.disabled[ctrl.type]} /> 
        ))}
    </div>
);

export default buildControls;