import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.2,
    meat: 1.2,
    bacon: 0.8
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }  

    state = {
        ingredients : {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 2
    }

    addIngredientHandler = (type) => {
         // добавяме продукт от съответен тип в state
         const oldCount = this.state.ingredients[type];
         const updatedCount = oldCount + 1;
         const updatedIngredients = {
             ...this.state.ingredients
         };
         updatedIngredients[type] = updatedCount;

         // обновяваме цената на бургера спрямо продукта
         const priceAddition = INGREDIENT_PRICES[type];
         const oldPrice = this.state.totalPrice;
         const newPrice = oldPrice + priceAddition;

         // обновяваме state-a
         this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    }

    removeIngredientHandler = (type) => {
        // премахваме продукт от съответен тип в state
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0)
            return; 

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        // обновяваме цената на бургера спрямо продукта
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        // обновяваме state-a
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        // превръщаме продуктите в 
        // {salad: true, meat: false ...}
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo} 
                    price={this.state.totalPrice}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;