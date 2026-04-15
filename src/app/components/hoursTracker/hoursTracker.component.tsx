import style from './hoursTracker.module.css'
import Card from "../card/card.component";
import CircularProgress from '../circularProgress/circularProgress.component';
import { useEffect, useState } from 'react';
import Loader from '../loader/loader.component';

const HoursTracker = () => {
  const [hours, setHours] = useState({
    total: "",
    done: "",
    todo: ""
  });
  const [loading, isLoading] = useState(true);

  const fetchHoursData = () => {
    setTimeout(() => {
      console.log("Fingindo que estamos esperando dados do backend");
      setHours({
        total: "60:00:00",
        done: "42:00:00",
        todo: "18:00:00"
      });

      isLoading(false);
    }, 3000);
  }

  useEffect(() => {
    fetchHoursData();
  }, []);

  return(
    <Card title="Controle de Horas" icon="arrow" className="fullWidth" classContent={style.hoursTrackerContent}>
    {
      loading ? (
        <Loader />
      ) : (
        <>
        <div className={style.hourSection}>
          <span className={`${style.hourCount} ${style.blue}`}>{hours.done}</span>
          <p className={style.hourCountTitle}>Concluídas</p>
          </div>
        <div className={style.hourSection}>
          <span className={`${style.hourCount} ${style.orange}`}>{hours.todo}</span>
          <p className={style.hourCountTitle}>A cumprir</p>
        </div>
        <div className={style.hourSection}>
          <span className={style.hourCount}>{hours.total}</span>
          <p className={style.hourCountTitle}>Total</p>
        </div>
        <div className={style.hourSection}>
          <CircularProgress percentage={65}/>
        </div>
        </>
        )
      }
    </Card>
  )
}
export default HoursTracker;