import React from 'react'
import './buttons.scss';

export const MainButton = (props) => {
  if ( props.loading ) {
    return (
      <div className={`${props.className} jc-c d-f ai-c disabled`} onClick={props.onClick} disabled>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    )
  } else {
    return (
      <button className={props.className} onClick={props.onClick} disabled={props.disabled} type={props.type}>
        {props.children}
        {props.value}
      </button>
    )
  }
}

export const MinimalButton = ({...props}) => (
  <button className={`minimal-btn ${props.classNames ? props.classNames : ""}`}  onClick={props.onClick} >
    {props.children}
  </button>
)

export const ThirdButton = ({...props}) => (
  <button 
    className={`btn btn-green ${props.classNames ? props.classNames : ""}`}
    onClick={props.onClick}
  > {props.text} </button>
)
