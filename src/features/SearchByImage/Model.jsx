import React from "react";
import "./Model.scss";
import croosimg from "../../../src/assets/img/cross.png";

function Model(props) {
  const showHideClassName = props.show
    ? "modal display-block"
    : "modal display-none";
  console.log("selectedFile", props.file);
  const modelclass = props.file == null ? "initial_modal" : "final_modal";
  const modelclose = props.file == null ? "close" : "close1";
  return (
    <div className={showHideClassName}>
      <section className={modelclass}>
        {/* {console.log(modelclass)} */}
        <button
          className={modelclose}
          type="button"
          onClick={props.handleClose}
        >
          <img className="cross-img" src={croosimg} alt="cross img" />
        </button>
        {props.children}
      </section>
    </div>
  );
}

export default Model;
