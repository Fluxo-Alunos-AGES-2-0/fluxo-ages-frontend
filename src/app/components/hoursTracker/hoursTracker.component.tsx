import style from './hoursTracker.module.css'
import Card from "../card/card.component";

interface HoursTrackerProps {
  hours: {
    total: string,
    done: string,
    todo: string
  }
}

const HoursTracker: React.FC<HoursTrackerProps> = ({ hours }) => {
  return(
    <Card title="Controle de Horas" icon="arrow" className="fullWidth" classContent={style.hoursTrackerContent}>
        <div className={style.hourSection}>
          <span className={`${style.hourCount} ${style.blue}`}>{hours.done}</span>
          <p>Concluídas</p>
          </div>
        <div className={style.hourSection}>
          <span className={`${style.hourCount} ${style.orange}`}>{hours.todo}</span>
          <p>A cumprir</p>
        </div>
        <div className={style.hourSection}>
          <span className={style.hourCount}>{hours.total}</span>
          <p>Total</p>
        </div>
    </Card>
  )
}
export default HoursTracker;