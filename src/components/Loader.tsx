import styles from '../css/Loader.module.css';

type Loaderprops = {
  marginTop: string;
};

const Loader = ({ marginTop }: Loaderprops) => {
  return (
    <div className={styles.loaderBox} style={{ marginTop: marginTop }}>
      <div className={styles.loader} />
    </div>
  );
};

export default Loader;
