import type {ReactNode} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Smart Attendance
        </Heading>
        <p className="hero__subtitle">
          勤怠管理をもっとスマートに。現場の業務効率化をサポートするクラウド型勤怠管理システムです。
        </p>
        <div style={{marginTop: 32}}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            サイトの使い方・ドキュメントを見る
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Smart Attendance" description="勤怠管理をもっとスマートに。現場の業務効率化をサポートするクラウド型勤怠管理システム">
      <HomepageHeader />
      <main style={{maxWidth: 900, margin: '0 auto', padding: 24}}>
        <section style={{marginBottom: 40}}>
          <Heading as="h2">Smart Attendanceとは</Heading>
          <p>
            Smart Attendanceは、出勤・退勤・休憩の打刻や各種申請、管理者による勤怠集計・レポート出力など、
            現場のニーズに応える多彩な機能を備えたクラウド型勤怠管理システムです。
          </p>
        </section>
        <section style={{marginBottom: 40}}>
          <Heading as="h2">主な特徴</Heading>
          <ul>
            <li>PC・スマートフォン両対応の直感的な操作画面</li>
            <li>有給・残業・遅刻などの申請・承認ワークフロー</li>
            <li>管理者用ダッシュボードでリアルタイム集計</li>
            <li>CSV/PDFでのレポート出力</li>
            <li>柔軟な権限管理・システム設定</li>
          </ul>
        </section>
        <section>
          <Heading as="h2">まずはドキュメントからご覧ください</Heading>
          <p>
            <Link to="/docs/intro">Smart Attendanceの機能・使い方を見る &rarr;</Link>
          </p>
        </section>
      </main>
    </Layout>
  );
}
