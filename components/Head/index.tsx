import { NextPage } from 'next';
import Head from 'next/head';

interface IHeadProps {
  title?: string;
  metaDesc?: string;
}

const HeadHtml: NextPage<IHeadProps> = ({
  title = 'Coffee Connoisseur',
  metaDesc = 'Coffee finder app from indonesia',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={metaDesc} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default HeadHtml;