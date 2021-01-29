import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Model from '../../components/UI/Model/Model';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
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
        ingredients : null,
        totalPrice: 2,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://burger-builder-f9480.firebaseio.com/ingredients.json')
            .then(res => {
                this.setState({ingredients: res.data});
            })
            .catch(err => {
                this.setState({error: true});
            });
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
        // this.setState({loading: true});

        // let today = new Date().toISOString().slice(0, 10);

        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice, // in a real app we have to calculate the price
        //     customer: {                  // on the server
        //         name: 'Atanas Ivanov',
        //         address: {
        //             street: 'VARNA MAIKA ST',
        //             zipCode: '9000',
        //             country: 'BG'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest',
        //     date: today                             
        // }

        // axios.post('/orders.json', order)
        //     .then(res => {
        //         this.setState({loading: false, purchasing: false});
        //         console.log(order);
        //     })
        //     .catch(err => {
        //         this.setState({loading: false, purchasing: false});
        //     });

        const queryParams = [];
        for(let i in this.state.ingredients) {
            // i is the key
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }

        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?'+queryString
        });
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

        let burger = this.state.error ? <h2 style={{textAlign: 'center', 
                                                    textTransform: 'uppercase'}}>Ingredients can't be loaded!</h2> : 
                                                    <Spinner />
        let orderSummary = null;

        if (this.state.ingredients) {
            burger = (
                <Aux>
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

            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>;    
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }
  
        return (
            <Aux>
                <Model show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Model>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);