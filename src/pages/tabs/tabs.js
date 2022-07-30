import React from 'react';
import { render } from 'react-dom';


class Mybtn extends React.Component{
    constructor() {
        super();
        this.state={
            account: 1
        }
    }
    add(){
        let account = this.state.account;
        account++;
        this.setState({
            account: account
        })
    }
    render() {
        return(
            <button onClick={()=>this.add()}>{this.state.account}</button>
            )
    }
}

render(<Mybtn />, window.document.querySelector('#root'));