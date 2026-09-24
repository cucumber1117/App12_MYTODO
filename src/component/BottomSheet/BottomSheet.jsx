import { useEffect, useRef } from 'react';
import styles from './BottomSheet.module.css';

export default function BottomSheet({ title, titleId, onClose, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <dialog ref={dialogRef} className={styles.sheet} aria-labelledby={titleId}
            onCancel={(event) => { event.preventDefault(); onClose(); }}
            onClick={(event) => {
                if (event.target !== event.currentTarget) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                if (event.clientX < bounds.left || event.clientX > bounds.right
                    || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
            }}>
            <div className={styles.handle} aria-hidden="true" />
            <header className={styles.header}>
                <h2 id={titleId}>{title}</h2>
                <button type="button" className={styles.close} onClick={onClose} aria-label={`${title}を閉じる`}>×</button>
            </header>
            {children}
        </dialog>
    );
}
