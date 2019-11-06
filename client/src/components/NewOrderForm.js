import React, { Component } from 'react';

class NewOrderForm extends Component {
    initialState = {description: '', price: 0, paymentMethod: 0, payed: false};

    constructor(props){
        super(props);
        this.state = {...this.initialState};

        this.handleChange =  this.handleChange.bind(this);
        this.handleSubmit =  this.handleSubmit.bind(this);
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.submitOrder({...this.state});
        this.setState({...this.initialState});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input onChange={this.handleChange} type="text" name="description" value={this.state.description}/>
                <input onChange={this.handleChange} type="number" name="price" value={this.state.price}/>
                <input onChange={this.handleChange} type="number" name="paymentMethod" value={this.state.paymentMethod}/>
                <input onChange={this.handleChange} type="text" name="payed" value={this.state.payed}/>
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default NewOrderForm;