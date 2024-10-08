import React from "react";
import styled from "styled-components";

const Toggler = ({setMenu,menu}) => {
  return (
      <div className="float-end  scale-75 px-[3.5vw]">
        <input type="checkbox" id="checkbox" onClick={()=>{
            setMenu(!menu)
        }}/>
        <label htmlFor="checkbox" className="toggle">
          <div className="bars" id="bar1" />
          <div className="bars" id="bar2" />
          <div className="bars" id="bar3" />
        </label>
      </div>
  );
};
export default Toggler;
