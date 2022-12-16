import React from "react";
import "./PWAPopup.scss";
import shareIcon from "../../../assets/svg/iphoneShare.svg";
import { useState, useEffect } from "react";

function PWAPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    debugger;
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Detects if device is in standalone mode
    const isInStandaloneMode = () =>
      "standalone" in window.navigator && window.navigator.standalone;

    if (isIos() && !isInStandaloneMode()) {
      setTimeout(() => {
        setShow(true);

        setTimeout(() => {
          setShow(false);
        }, 10000);
      }, 10000);
    }
  }, [show]);

  return (
    <>
      <div id="ios-pwa-popup" className={show ? "show" : ""}>
        <p>
          Install this webapp on your iPhone: tap
          <img class="share-icon" src={shareIcon} alt="Share" /> and then Add to
          Homescreen.
        </p>
      </div>
    </>
  );
}

export default PWAPopup;
