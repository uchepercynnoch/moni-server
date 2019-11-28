import React from "react";

const SuperAdministrator = ({value, changePage, data}) => {
    return data.map(({id, label, name, icon}) => {
        if (name.substring(0, 11) === 'super_admin') {
            return <div style={{cursor: 'pointer'}} onClick={() => changePage(id)} key={name}
                        className={value === id ? 'br-menu-link active' : 'br-menu-link'}>
                <div className="br-menu-item">
                    <i className={icon.substring(0, 3) !== 'ion' ? `menu-item-icon fa ${icon} tx-20` : `menu-item-icon ion ${icon} tx-20`}></i>
                    <span id={id} className="menu-item-label">{label}</span>
                </div>
            </div>
        }
        return null;

    })
};

export default SuperAdministrator;