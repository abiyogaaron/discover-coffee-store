import { NextPage } from "next";
import Image from 'next/image';

import styles from './Banner.module.css';

interface IBannerProps {
  buttonText: string;
  handleOnClick: () => void;
}

const Banner: NextPage<IBannerProps> = (props) => {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <span className={styles.title1}>Coffee</span>
          <span className={styles.title2}>Connoisseur</span>
        </h1>
        <p className={styles.subTitle}>Discover your local coffee stores!</p>
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={props.handleOnClick}>
            {props.buttonText}
          </button>
        </div>
      </div>
      <div className={styles.heroImage}>
        <Image src="/static/hero-image.png" width={700} height={400} alt="banner-image" />
      </div>
    </>
  );
}

export default Banner;