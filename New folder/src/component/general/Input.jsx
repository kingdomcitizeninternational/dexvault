import React from 'react'
import styles from './Input.module.css'

let InputCard = ({label,value,onChange,type}) => {
    if(label === "Account Balance"){
        return <div className={styles.form_input_card}>
                <label>{label}</label>
                <input required
                value={value} onChange={onChange} readOnly type={type}/>
                
            </div>

    }
    return <div className={styles.form_input_card}>
                <label>{label}</label>
                <input required
                value={value} onChange={onChange} type={type}/>
            </div>

}

export default InputCard