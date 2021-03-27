import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});

        let todayDate = new Date();
        let today = todayDate.toISOString().slice(0, 10);
        let hour = todayDate.getHours() + ":" + todayDate.getMinutes() + ":" + todayDate.getSeconds();
        
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price, // in a real app we have to calculate the price
            customer: {                  // on the server
                name: 'Atanas Ivanov',
                address: {
                    street: 'VARNA MAIKA ST',
                    zipCode: '9000',
                    country: 'BG'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest',
            date: today,
            hour: hour                             
        }

        axios.post('/orders.json', order)
            .then(res => {
                this.setState({loading: false});
                this.props.history.push('/');
                console.log(order);
            })
            .catch(err => {
                this.setState({loading: false});
            });
    }

    render() {
        let form = (
            <form>
                <input type="text" name="name" placeholder="Name"/>
                <input type="text" name="email" placeholder="Email"/>
                <input type="text" name="street" placeholder="Street"/>
                <input type="text" name="postal" placeholder="Postal Code"/>
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;