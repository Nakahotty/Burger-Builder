import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Model from '../../components/UI/Model/Model';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';

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
        totalPrice: 2,
        purchaseable: false,
        purchasing: false
    }

    updatePurchaseState (ingredients) {
        // създава масив от ключовете - salad, bacon, cheese... => връщаме стойноста по ключа => събира ги чрез reduce
        const sum = Object.keys(ingredients) 
            .map(igKey => {
                return ingredients[igKey];    
            })
            .reduce((sum, el) => {    // reduces to a single number
                return sum + el;
            }, 0);

        // ако sum има поне 1 елемент => бургерът е закупуваем
        this.setState({purchaseable: sum > 0});
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
         
         // обновяваме за бутона активен/неактивен
         this.updatePurchaseState(updatedIngredients);
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

        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice, // in a real app we have to calculate the price
            customer: {                  // on the server
                name: 'Atanas Ivanov',
                address: {
                    street: 'VARNA MAIKA ST',
                    zipCode: '9000',
                    country: 'BG'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'                              
        }

        axios.post('/orders.json', order)
            .then(res => console.log(res))
            .catch(err => console.log(err));
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
                <Model show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}/>    
                </Model> 
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo} 
                    purchaseable={this.state.purchaseable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice}/>
            </Aux>
        );
    }
}

export default BurgerBuilder;