import React from "react";
import { Link } from "react-router-dom";
import styles from "./PrivacyPolicy.module.css";

export const PrivacyPolicy = () => {
    return (
        <div className={styles.page}>
            <div className={styles.contentCard}>
                <Link to="/" className={styles.btn}>
                    ← Back to Game
                </Link>

                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last Updated: February 2026</p>

                <h2 className={styles.sectionTitle}>1. Introduction</h2>
                <p className={styles.text}>This Privacy Policy describes how the "Battleship Game" web application (hereinafter referred to as "the Application") handles information when you use this browser-based game.</p>
                <p className={styles.text}>This document is prepared in accordance with the General Data Protection Regulation (EU) 2016/679 (GDPR).</p>
                <p className={styles.text}>The Application is developed for educational purposes and operates entirely on the client side (in your browser).</p>
                <p className={styles.text}>In this document:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>"we", "us", "our" refer to the developer — Sofiia Maidanuk.</li>
                    <li className={styles.listItem}>"you", "your" refer to the user of the Application.</li>
                </ul>

                <h2 className={styles.sectionTitle}>2. Data Controller</h2>
                <p className={styles.text}><strong>Developer:</strong> Sofiia Maidanuk<br /><strong>Year:</strong> 2026</p>
                <p className={styles.text}>The Application does not operate any backend server and does not process data externally.</p>

                <h2 className={styles.sectionTitle}>3. What Data We Collect</h2>
                <p className={styles.text}>The Application does NOT collect or transmit personal data to any server. All data is stored locally in your browser.</p>

                <h3 className={styles.subSectionTitle}>3.1 Cookies</h3>
                <p className={styles.text}>We use one strictly necessary cookie:</p>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>battleship-gdpr-consent</td>
                        <td>Stores your consent choice (Accept / Reject) in compliance with GDPR</td>
                    </tr>
                    </tbody>
                </table>
                <p className={styles.text}>This cookie:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Does not store personal information</li>
                    <li className={styles.listItem}>Is stored for 150 days</li>
                    <li className={styles.listItem}>Is used only to remember your consent preference</li>
                </ul>

                <h3 className={styles.subSectionTitle}>3.2 Local Storage</h3>
                <p className={styles.text}>The Application uses browser Local Storage to persist game-related data:</p>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Storage Key</th>
                        <th>Purpose</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td>userId</td><td>Randomly generated identifier for local game sessions</td></tr>
                    <tr><td>game state</td><td>Current game progress</td></tr>
                    <tr><td>timers</td><td>Game timers</td></tr>
                    <tr><td>results history</td><td>Match statistics and history</td></tr>
                    <tr><td>settings</td><td>User preferences</td></tr>
                    </tbody>
                </table>
                <p className={styles.text}>This data:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>Remains on your device</li>
                    <li className={styles.listItem}>Is never transmitted to third parties</li>
                    <li className={styles.listItem}>Is never shared externally</li>
                </ul>

                <h2 className={styles.sectionTitle}>4. What We Do NOT Collect</h2>
                <p className={styles.text}>We do NOT collect: Real names, Email addresses, Phone numbers, Physical addresses, IP addresses, Geolocation data, Payment information, or Biometric data.</p>
                <p className={styles.text}>We do NOT use: Analytics services, Advertising networks, Third-party tracking scripts, or External APIs.</p>

                <h2 className={styles.sectionTitle}>5. Legal Basis (GDPR)</h2>
                <p className={styles.text}>Processing is based on:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}><strong>Article 6(1)(a) GDPR</strong> — Your consent (for non-essential storage).</li>
                    <li className={styles.listItem}><strong>Article 6(1)(f) GDPR</strong> — Legitimate interest (necessary functionality of the game).</li>
                </ul>

                <h2 className={styles.sectionTitle}>6. Data Storage and Retention</h2>
                <p className={styles.text}>All data is stored locally in your browser. Data remains stored until you clear your browser cookies, clear Local Storage, or reset/uninstall your browser. The Application does not impose any server-side retention policy because no data is stored on any server.</p>

                <h2 className={styles.sectionTitle}>7. Your Rights Under GDPR</h2>
                <p className={styles.text}>Since all data is stored locally, you can exercise your rights directly:</p>
                <ul className={styles.list}>
                    <li className={styles.listItem}><strong>Right of Access</strong> — View your stored game data in the browser.</li>
                    <li className={styles.listItem}><strong>Right to Rectification</strong> — Modify data via browser tools or reset game.</li>
                    <li className={styles.listItem}><strong>Right to Erasure</strong> — Clear cookies and Local Storage.</li>
                    <li className={styles.listItem}><strong>Right to Restriction</strong> — Disable cookies or Local Storage in browser settings.</li>
                    <li className={styles.listItem}><strong>Right to Data Portability</strong> — Export data via browser developer tools.</li>
                    <li className={styles.listItem}><strong>Right to Object</strong> — Reject cookies via the consent banner.</li>
                    <li className={styles.listItem}><strong>Right to Lodge a Complaint</strong> — Contact your local data protection authority if necessary.</li>
                </ul>

                <h2 className={styles.sectionTitle}>8. Children's Privacy</h2>
                <p className={styles.text}>The Application does not knowingly collect personal data from children. Since no data is transmitted externally, there are no additional risks related to minors.</p>

                <h2 className={styles.sectionTitle}>9. International Data Transfers</h2>
                <p className={styles.text}>No data is transferred internationally. All information remains stored on your device.</p>

                <h2 className={styles.sectionTitle}>10. Automated Decision-Making</h2>
                <p className={styles.text}>The Application does not perform profiling or automated decision-making as defined in Article 22 GDPR.</p>

                <h2 className={styles.sectionTitle}>11. Changes to This Policy</h2>
                <p className={styles.text}>We reserve the right to update this Privacy Policy. Changes will be reflected by updating the "Last Updated" date.</p>

                <h2 className={styles.sectionTitle}>12. Contact</h2>
                <p className={styles.text}>For questions regarding this Privacy Policy, please open an issue in the project's source code repository.</p>
            </div>
        </div>
    );
};
