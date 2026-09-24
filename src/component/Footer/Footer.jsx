import {NavLink} from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
    return(
        <nav className={styles.footer} aria-label="メインナビゲーション">
            <NavLink className={({ isActive }) => `${styles.footerLink} ${isActive ? styles.active : ''}`} to="/" end>
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 11h16m-11 5h2"/></svg>
            ホーム
            </NavLink>
            <NavLink className={({ isActive }) => `${styles.footerLink} ${isActive ? styles.active : ''}`} to="/setting">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/></svg>
            設定
            </NavLink>
        </nav>
    );
}

export default Footer
