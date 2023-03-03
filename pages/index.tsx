import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import { getCoffeeStores } from '../services';
import { ICoffeeStoresData } from '../types';
import { DEFAULT_LAT_LONG } from '../constants';

import Banner from '../components/Banner';
import HeadHtml from '../components/Head';
import Card from '../components/Card';

import styles from '../styles/pages/Home.module.css';
import { useGeoLocation } from '../hooks';
import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../context';
import { EAppAction } from '../types/context';

interface IStaticProps {
  data: ICoffeeStoresData[];
}

export const getStaticProps: GetStaticProps<IStaticProps> = async () => {
  const coffeeStores = await getCoffeeStores(
    DEFAULT_LAT_LONG,
    'coffee',
    6,
  );
  return {
    props: {
      data: coffeeStores,
    }
  }
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  data,
}) => {
  const { state: {
    home: {
      latLong,
      coffeeStores,
    }
  }, dispatch } = useAppContext();

  const {
    isFinding,
    geoError,
    trackLocation,
  } = useGeoLocation();

  useEffect(() => {
    if (geoError.isError) {
      alert(geoError.title);
    }
  }, [geoError]);

  useEffect(() => {
    const getCoffeeStoreByLoc = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/coffee-store?latLong=${latLong}&limit=${30}`
          );
          const stores = await response.json();
          dispatch({
            type: EAppAction.SET_COFFEE_STORES,
            payload: stores.data,
          })
        } catch (err) {
          console.error(`http call error: ${err}`)
        }
      }
    }
    getCoffeeStoreByLoc();
  }, [latLong]);

  const renderCard = useCallback(() => {
    if (coffeeStores.length > 0) {
      return coffeeStores.map((store) => {
        return (
          <Card
            key={store.id}
            name={store.name}
            imgUrl={store.imgUrl}
            href={`/coffee-store/${store.id}`}
          />
        )
      });
    }

    return data.map((store) => {
      return (
        <Card
          key={store.id}
          name={store.name}
          imgUrl={store.imgUrl}
          href={`/coffee-store/${store.id}`}
        />
      )
    });
  }, [coffeeStores, data])

  return (
    <div className={styles.container}>
      <HeadHtml />
      <main className={styles.main}>
        <Banner
          buttonText={isFinding ? 'Locating...' : 'View stores nearby'}
          handleOnClick={trackLocation}
        />
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores near me</h2>
          <div className={styles.cardLayout}>
            {renderCard()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
