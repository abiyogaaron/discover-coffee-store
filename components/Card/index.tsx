import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";

import styles from "./Card.module.css";

interface ICardProps {
  name: string;
  imgUrl: string;
  href: string;
}

const Card: NextPage<ICardProps> = ({
  name,
  imgUrl,
  href,
}) => {
  return (
    <Link href={href} className={styles.cardLink}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={imgUrl}
            width={260}
            height={160}
            alt={name}
          />
        </div>
      </div>
    </Link>
  );
}

export default Card;