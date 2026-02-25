import React from "react";
import CookieConsent from "react-cookie-consent";

export const GdprConsent = () => {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Accept"
            declineButtonText="Reject"
            enableDeclineButton
            cookieName="battleship-gdpr-consent"
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
            }}
            onDecline={() => {
                console.log("User declined GDPR consent.");
            }}
        >
            This application uses browser local storage to save game progress,
            timers and match history. According to GDPR requirements, we ask for
            your consent before storing this data. Read more in our{" "}
            <a href="/privacy-policy" style={{ color: "#4CAF50" }}>
                Privacy Policy
            </a>.
        </CookieConsent>
    );
};
