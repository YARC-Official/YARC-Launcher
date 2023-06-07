import styles from './Sidebar.module.css';
import { ReactComponent as DiscordIcon } from '@app/assets/Discord.svg';
import { ReactComponent as TwitterIcon } from '@app/assets/Twitter.svg';
import { ReactComponent as GithubIcon } from '@app/assets/Github.svg';

const Sidebar: React.FC = () => {
  return <div className={styles.sidebar}>

    <div className={styles.footer}>
      <div className={styles.credits}>YARC 2023</div>
      <div className={styles.socials}>
        <a href="https://twitter.com/" className={styles.link}><DiscordIcon /></a>
        <a href="https://twitter.com/" className={styles.link}><TwitterIcon /></a>
        <a href="https://twitter.com/" className={styles.link}><GithubIcon /></a>
      </div>
    </div>
  </div>;
}

export default Sidebar;