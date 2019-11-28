import React, {Component} from 'react';

class Customers extends Component {
    render() {
        return (
            <div className="br-mainpanel" id="dashboard">
                <div className="pd-30">
                    <h4 className="tx-gray-800 mg-b-5">Customers {this.props.id}</h4>
                </div>
            </div>
        );
    }
}

export default Customers;