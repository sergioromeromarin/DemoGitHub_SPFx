import * as React from 'react';
import styles from './PlanningHome.module.scss';
import { useNavigate } from 'react-router-dom';
import { Paths } from 'utils/Constants';
import { Menu } from 'FacultyTasksWebPartStrings';
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { Planning } from "FacultyTasksWebPartStrings";

const PlanningHome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <SectionHeader
                label={Planning.Header.Tag}
                title={Planning.Header.Title}
                subtitle={Planning.Header.Subtitle}
            />
            <div className={styles.cardsContainer}>
                <div
                    className={styles.card}
                    onClick={() => navigate(Paths.Planning_MyAvailabitity)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            navigate(Paths.Planning_MyAvailabitity);
                        }
                    }}
                >
                    <div className={styles.cardImageSection}>
                        <img src={require("../../../assets/My-academic-availability.jpg")} alt="Availability" className={styles.cardImage} />
                    </div>
                    <div className={styles.cardTextSection}>
                        <h2 className={styles.cardTitle}>{Menu.Planning.MyAvailability}</h2>
                    </div>
                </div>

                <div
                    className={styles.card}
                    onClick={() => navigate(Paths.Planning_MyAssignments)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            navigate(Paths.Planning_MyAssignments);
                        }
                    }}
                >
                    <div className={styles.cardImageSection}>
                        <img src={require("../../../assets/My-allocated-academic-duties.jpg")} alt="Allocation" className={styles.cardImage} />
                    </div>
                    <div className={styles.cardTextSection}>
                        <h2 className={styles.cardTitle}>{Menu.Planning.MyAssignments}</h2>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlanningHome;
