import {Link} from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
    return(
        <footer className={styles.footer}>
            <Link className={styles.footerLink} to="/">
            ホーム
            </Link>
            <Link className={styles.footerLink} to="/todo">
            Todo
            </Link>
            <Link className={styles.footerLink} to="/setting">
            設定
            </Link>
        </footer>
    );
}

export default Footer