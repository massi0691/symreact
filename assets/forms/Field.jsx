import React from 'react';

const Field = ({name, label, value, onChange, placeholder="", type="text", error=""} ) => {
    return (
        <div className="form-group">
            <label htmlFor={name}> {label}</label>
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                className={`form-control ${error && 'is-invalid'}`}
                name={name}
                value={value}
                onChange={onChange}
            />
            {error && <p className="invalid-feedback">
                {error}
            </p>}
        </div>

    );
};


export default Field;
