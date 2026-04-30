import React from "react";
import styles from "./Loader.module.scss";

export interface ILoaderProps {
    heightVH: number;
}

const Loader: React.FC<ILoaderProps> = ({ heightVH }) => {
    return (
        <div className={styles.loaderWrapper} style={{ height: `${heightVH}vh` }}><span className={styles.loader} /></div>
    );
};

export default Loader;
