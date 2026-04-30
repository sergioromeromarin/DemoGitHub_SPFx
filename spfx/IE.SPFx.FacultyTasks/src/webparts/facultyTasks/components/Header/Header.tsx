import React from "react";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <img src={require("../../assets/logo_ie.png")} alt="IE Logo" />
            </div>
            <div className={styles.title}>FACULTY TASKS</div>
        </header>
    );
};

export default Header;
