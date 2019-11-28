import React, {Component} from 'react';

class Error extends Component {
    render() {
        return (
            <div className="ht-100v d-flex align-items-center justify-content-center">
                <div className="wd-lg-70p wd-xl-50p tx-center pd-x-40">
                    <h1 className="tx-100 tx-xs-140 tx-normal tx-inverse tx-roboto mg-b-0">404!</h1>
                    <h5 className="tx-xs-24 tx-normal tx-info mg-b-30 lh-5">The page your are looking for has not been
                        found.</h5>
                    <p className="tx-16 mg-b-30">The page you are looking for might have been removed, had its name
                        changed,
                        or unavailable. Maybe you could try a search:</p>

                    <div className="d-flex justify-content-center">
                        <div className="input-group wd-xs-300">
                            <input type="text" className="form-control" placeholder="Search..."/>
                            <div className="input-group-btn">
                                <button className="btn btn-info"><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Error;