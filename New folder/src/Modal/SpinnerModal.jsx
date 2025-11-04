import React from "react";
import { Spinner } from 'react-activity';

export const SpinnerModal = () => {
  
  return <div style={{
    width: '100%',
    height: '200px',
    display: 'flex',
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '20px'
}}>
    <Spinner size={24} color="#4F46E5" speed={0.5} animating={true} />
</div>
  
};



