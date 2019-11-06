import React from 'react';
import Alert from 'react-bootstrap/Alert';

const withAlert = (Component) => {
    
    return class extends React.Component{
        constructor(props){
            super(props);
            this.showAlert = this.showAlert.bind(this);

            this.state = {
                show: false,
                message: '',
                variant: ''
            };
        }
        
        showAlert(options){
            const {message, variant} =  options;
            this.setState({show: true, message: message, variant: variant});
        }

        render(){
            return(
                <>
                    <Alert
                    dismissible
                    variant = {this.state.variant}
                    show = {this.state.show}
                    onClose={()=>{this.setState({show: false})}}>
                        {this.state.message}
                    </Alert>
                    <Component showAlert={this.showAlert} {...this.props}></Component>
                </>
            )
        }
    }
}

export default withAlert;