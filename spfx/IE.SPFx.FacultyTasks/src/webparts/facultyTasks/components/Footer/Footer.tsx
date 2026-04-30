import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.leftSection}>
                <img src={require("../../assets/logo_ie.png")} alt="IE Logo" />
            </div>
        </footer>
    );
};

export default Footer;
