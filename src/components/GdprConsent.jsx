import React from "react";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

export const GdprConsent = () => {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Accept"
            declineButtonText="Reject"
            enableDeclineButton
            cookieName="battleship-gdpr-consent"
            overlay={true}
            overlayClasses="overlay-gdpr"
            style={{ background: "#1e1e1e", alignItems: "center" }}
            buttonStyle={{
                background: "#4CAF50",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "4px",
            }}
            declineButtonStyle={{
                background: "#d32f2f",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "4px",
            }}
            expires={150}
            onAccept={() => {
                console.log("User accepted GDPR consent.");
                window.location.reload();
            }}
            onDecline={() => {
                console.log("User declined GDPR consent.");
                window.location.reload();
            }}
        >
            This application uses browser local storage to save game progress,
            timers and match history. According to GDPR requirements, we ask for
            your consent before storing this data. Read more in our{" "}
            <Link to="/privacy-policy" style={{ color: "#4CAF50", textDecoration: "underline" }}>
                Privacy Policy
            </Link>.
        </CookieConsent>
    );
};
