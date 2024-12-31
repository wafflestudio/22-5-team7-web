import triangleDown from '../assets/triangledown.svg';
import styles from '../css/TemperatureGauge.module.css';

type TemperatureGaugeProps = {
  temperature: number;
};

const TemperatureGauge = ({ temperature }: TemperatureGaugeProps) => {
  const getFillColor = (value: number) => {
    if (value <= 25) return '#0000FF'; // Blue
    if (value <= 50) return '#00AD83'; // Green
    if (value <= 75) return '#ff8a3d'; // Orange
    return '#FF5733'; // Dark Orange
  };

  const getEmoji = (value: number) => {
    if (value <= 25) return '😞';
    if (value <= 50) return '🙂';
    if (value <= 75) return '😄';
    return '😆';
  };

  return (
    <div className={styles.gaugeContainer}>
      <div className={styles.upperBox}>
        <div className={styles.indicator}>
          <p>첫 온도 36.5°C</p>
          <img src={triangleDown} style={{ width: '14px', height: '10px' }} />
        </div>
        <div
          className={styles.temperature}
          style={{ color: getFillColor(temperature) }}
        >
          <span>{temperature}°C</span>
          <span style={{ fontSize: '26px' }}>{getEmoji(temperature)}</span>
        </div>
      </div>
      <div className={styles.gaugeBackground}>
        <div
          className={styles.gaugeFill}
          style={{
            width: `${temperature}%`,
            backgroundColor: getFillColor(temperature),
          }}
        />
      </div>
    </div>
  );
};

export default TemperatureGauge;
