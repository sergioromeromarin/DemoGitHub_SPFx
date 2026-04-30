import * as React from 'react';
import styles from './SectionHeader.module.scss';
import { ISectionHeaderProps } from './ISectionHeaderProps';

const SectionHeader: React.FC<ISectionHeaderProps> = (props) => {

    const { label, title, subtitle } = props;

    return (
        <section className={styles.sectionHeader}>
            <div className={styles.textZone}>
                <span>{label}</span>
                <h1>{title}</h1>
                <h3>{subtitle}</h3>
            </div>
        </section>
    );
};

export default SectionHeader;