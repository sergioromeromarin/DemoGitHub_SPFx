import * as React from "react";
import styles from "./TasksDueSoonCarrousel.module.scss";
import { ITasksDueSoonCarrousel } from "./models";
import { Shimmer, ShimmerElementType } from "@fluentui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, A11y } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import TaskCard from "./components/TaskCard/TaskCard";
import { MyTasks } from "FacultyTasksWebPartStrings";

const TasksDueSoonCarrousel: React.FC<ITasksDueSoonCarrousel> = ({ isDataLoaded, tasks }) => {
  
  const shimmerSlides = React.useMemo(() => Array.from({ length: 4 }, (_, idx) => ({ key: `shimmer-${idx}` })),[]);

  const hasTasks = !!tasks?.length;

  return (
    <section className={styles.dueSoonCarrouselContainer}>
      <div className={styles.header}>
        {/* <div className={styles.tag}>{MyTasks.Carrousel.Tag}</div> */}
        <div className={styles.title}>{MyTasks.Carrousel.Title}</div>
        <div className={styles.subTitle}>{MyTasks.Carrousel.Subtitle}</div>
      </div>

      <div className={styles.carousel}>
        {isDataLoaded && !hasTasks ? (
          <div className={styles.noPendingTasks}>{MyTasks.Carrousel.NoPendingTasksMessage}</div>
        ) : (
          <Swiper
            modules={[Pagination, Navigation, A11y]}
            spaceBetween={18}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              720: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {!isDataLoaded? 
            
            shimmerSlides.map(({ key }) => (
                  <SwiperSlide key={key}>
                    <div className={styles.shimmerCard}>
                      <Shimmer shimmerElements={[{ type: ShimmerElementType.line, height: 320, width: "100%" }]} />
                    </div>
                  </SwiperSlide>
                ))
              : 
              tasks.map((task, idx) => (
                  <SwiperSlide key={`${task.url}-${idx}`}>
                    <TaskCard task={task} />
                  </SwiperSlide>
                ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default TasksDueSoonCarrousel;
