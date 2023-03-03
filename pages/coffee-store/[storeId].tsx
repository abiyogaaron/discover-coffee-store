import { 
  GetStaticProps, 
  GetStaticPaths,
  NextPage,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import cls from "classnames";

import { createCoffeeStore, getCoffeeStores, voteCoffeeStore } from "../../services";
import {
  ICoffeeStoresData,
} from "../../types";
import { DEFAULT_LAT_LONG, END_POINTS } from "../../constants";

import HeadHtml from "../../components/Head";

import styles from '../../styles/pages/CoffeeStores.module.css';
import { useAppContext } from "../../context";
import { useEffect, useMemo, useState } from "react";
import { fetcher } from "../../utils";

interface IStaticProps {
  data: ICoffeeStoresData | null;
}

export const getStaticProps: GetStaticProps<IStaticProps> = async (context) => {
  const { params } = context;

  const coffeeStores = await getCoffeeStores(
    DEFAULT_LAT_LONG,
    'coffee',
    6,
  )
  const foundedStoreId = coffeeStores.find((store) => {
    return store.id === params?.storeId
  });

  return {
    props: {
      data: foundedStoreId ? foundedStoreId : null,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const coffeeStores = await getCoffeeStores(
    DEFAULT_LAT_LONG,
    'coffee',
    6,
  )
  const paths = coffeeStores.map((store) => {
    return {
      params: {
        storeId: store.id,
      }
    }
  });

  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data: staticCoffeeStore,
}) => {
  const { isFallback, query } = useRouter();
  const { state: {
    home: {
      coffeeStores: coffeeStoresContext,
    }
  }} = useAppContext();
  const { data: storeRecords, error } = useSWR(`/api/coffee-store/${query.storeId}`, fetcher);

  const foundedStore: ICoffeeStoresData | null = useMemo(() => {
    return coffeeStoresContext.find((store) => {
      return store.id.toString() === query.storeId
    });
  }, [coffeeStoresContext]);

  const [storeDetail, setStoreDetail] = useState<ICoffeeStoresData | null>(staticCoffeeStore || foundedStore);
  const [votingCount, setVotingCount] = useState<number>(0);

  useEffect(() => {
    // Static site generation
    if (staticCoffeeStore) {
      createCoffeeStore({ ...staticCoffeeStore, voting: 0})
    }
  }, [query.storeId]);

  useEffect(() => {
    // Get from Context data
    if (foundedStore) {
      createCoffeeStore({ ...foundedStore, voting: 0 })
    }
  }, [foundedStore])

  useEffect(() => {
    // CSR, fetch from airtable
    if (storeRecords && storeRecords.length > 0) {
      setStoreDetail(storeRecords[0]);
      setVotingCount(storeRecords[0].voting);
    }
  }, [storeRecords]);

  const handleVote = async () => {
    try {
      const reqHeaders: HeadersInit = new Headers();
      reqHeaders.set('Content-type', 'application/json');
  
      const response = await fetch(END_POINTS.VOTE, {
        method: 'PUT',
        headers: reqHeaders,
        body: JSON.stringify({ id: storeDetail?.id })
      });
  
      const coffeeStore = await response.json();
      if (coffeeStore && coffeeStore.length > 0) {
        setVotingCount(coffeeStore[0].voting);
      }
    } catch (err) {
      console.error(`error http call: `, err);
    }
  }

  if (isFallback) {
    return <div>Loading ...</div>
  }

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  if (!storeDetail) {
    return (
      <div className={styles.layout}>
        <div>Data not found ...</div>
      </div>
    )
  }

  const { address, neighborhood , name, imgUrl } = storeDetail;

  return (
    <div className={styles.layout}>
      <HeadHtml />
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name || ''}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleVote}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoffeeStore;