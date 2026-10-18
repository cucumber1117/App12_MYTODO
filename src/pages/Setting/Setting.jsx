import styles from './Setting.module.css';
import { Link } from 'react-router-dom';
import useTasks from '../../useTasks.js';
import { repeatLabel } from '../../tasks.js';
import { formatDate } from '../Home/dates.js';

function Setting({ periodSettings, onPeriodSettingsChange }) {
  const [tasks, saveTasks] = useTasks();
  const recurring = tasks.filter((task) => task.repeat && task.repeat !== 'none');
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <p className={styles.eyebrow}>PREFERENCES</p>
        <h1>設定<span>。</span></h1>
        <p className={styles.intro}>自分のリズムに合わせて。</p>
        <fieldset className={styles.options}>
          <legend>表示する時間帯</legend>
          <label className={styles.option}>
            <span className={styles.optionText}>朝を表示する<small>一日のはじまりを、ひと区切りに。</small></span>
            <input type="checkbox" role="switch" aria-label="朝を表示する" checked={periodSettings.showMorning}
              onChange={(event) => onPeriodSettingsChange({ ...periodSettings, showMorning: event.target.checked })} />
          </label>
          <label className={styles.option}>
            <span className={styles.optionText}>夜を表示する<small>夜の予定を、まとめて見やすく。</small></span>
            <input type="checkbox" role="switch" aria-label="夜を表示する" checked={periodSettings.showNight}
              onChange={(event) => onPeriodSettingsChange({ ...periodSettings, showNight: event.target.checked })} />
          </label>
        </fieldset>
        <p className={styles.description}>午前・午後は常に表示します。朝を非表示にすると朝の予定は午前に、夜を非表示にすると夜の予定は午後に表示されます。</p>
        <p className={styles.description}>変更は自動で保存され、予定追加の選択肢にも反映されます。</p>
        <section className={styles.recurring}>
          <h2>定期タスク</h2>
          <p className={styles.description}>毎日や決まった曜日の予定を管理します。終了すると翌日以降は表示されず、過去の記録は残ります。</p>
          <Link className={styles.addRecurring} to="/?recurring=1">＋ 定期タスクを追加</Link>
          {recurring.length === 0 && <p className={styles.description}>定期タスクはまだありません。</p>}
          <ul className={styles.recurringList}>
            {recurring.map((task) => <li key={task.id}>
              <div><strong>{task.text}</strong><p>{repeatLabel(task)} · {task.time || task.period}</p>
                <p>{task.date}から{task.endDate ? ` ${task.endDate}まで` : ''}</p></div>
              {task.endDate ? <span>終了</span> : <button type="button" onClick={() => saveTasks(tasks.map((item) => item.id === task.id
                ? { ...item, endDate: formatDate(new Date()) } : item))}>今日で終了</button>}
            </li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Setting;
