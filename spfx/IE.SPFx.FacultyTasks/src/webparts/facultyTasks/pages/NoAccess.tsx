import * as React from 'react';
import styles from "./NoAccess.module.scss";
import { NoAccessPage } from 'FacultyTasksWebPartStrings';

const NoAccess: React.FC = () => (
    <div className={styles.noAccess}>
        <h1>{NoAccessPage.Title}</h1>
        <h3>{NoAccessPage.Message}</h3>
        <img src={require("../assets/error_unauthorized.svg")} alt={NoAccessPage.Title} />
    </div>
);

export default NoAccess;