import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ label, isChecked, onChange }) => {
    return (
        <div className="toggle-switch-container">
            <label className="toggle-switch">
                <input type="checkbox" checked={isChecked} onChange={onChange} />
                <span className="slider round"></span>
            </label>
            <span>{label}</span>
        </div>
    );
};

export default ToggleSwitch; 