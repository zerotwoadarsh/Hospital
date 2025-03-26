
import { createContext } from "react";


// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currency='$';
  
  const calculateAge=(dob)=>{

    const today=new Date();
    const birthDate=new Date(dob);
    
    
    let age=today.getFullYear()-birthDate.getFullYear();

    return age;

  }
  const months=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","sep","oct","Nov","Dec"];
 
 
  const slotDateFormat =(slotDate)=>{
    const dateArray =slotDate.split('_');
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2];
  }

  const value = {
    calculateAge,
    slotDateFormat,
    currency,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
