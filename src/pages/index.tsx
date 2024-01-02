import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

import styles from '../styles/Home.module.css';

interface HomeProps {
    queryData: any;
}

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
const SignTransactionDynamic = dynamic(async () => (await import('../components/SignTransaction')).SignTransaction, {
    ssr: false,
});

const Home: NextPage<HomeProps> = (props) => {
    const { queryData } = props;

    return (
        <div className={styles.container}>
            <Head>
                <title>Passes</title>
                <meta name="description" content="Passes" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://sagadao.io">Passes!</a>
                </h1>

                <div className={styles.walletButtons}>
                    <WalletMultiButtonDynamic />
                    <WalletDisconnectButtonDynamic />
                </div>

                {/* <p className={styles.description}>
                    Get started by editing <code className={styles.code}>pages/index.tsx</code>
                </p> */}

                <p>
                    <SignTransactionDynamic queryData={queryData} />
                </p>

                {/* <div className={styles.grid}>
                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h2>Documentation &rarr;</h2>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a href="https://github.com/vercel/next.js/tree/master/examples" className={styles.card}>
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
                    </a>
                </div> */}
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    );
};

export default Home;

export async function getServerSideProps(context) {
    const queryData = context.query;
  
    return {
      props: {
        queryData,
      },
    };
  }
  
  async function parseBody(req) {
    return new Promise((resolve, reject) => {
      let data = '';
  
      req.on('data', (chunk) => {
        data += chunk;
      });
  
      req.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
  
      req.on('error', (error) => {
        reject(error);
      });
    });
  }