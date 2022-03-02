import React from 'react';

const ButtonWithProgress = (props) => {

    const { onClick, pendingApiCall, disabled, label, className } = props;

    return (
        <button className={className} onClick={onClick} disabled={disabled}>
            {pendingApiCall && <span className="spinner-border spinner-border-sm"></span>}
            {label}
        </button>
    );
};

export default ButtonWithProgress;