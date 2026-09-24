import styles from './Setting.module.css';

function Setting({ periodSettings, onPeriodSettingsChange }) {
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <h1>設定</h1>
        <fieldset className={styles.options}>
          <legend>表示する時間帯</legend>
          <label className={styles.option}>
            <input type="checkbox" checked={periodSettings.showMorning}
              onChange={(event) => onPeriodSettingsChange({ ...periodSettings, showMorning: event.target.checked })} />
            朝を表示する
          </label>
          <label className={styles.option}>
            <input type="checkbox" checked={periodSettings.showNight}
              onChange={(event) => onPeriodSettingsChange({ ...periodSettings, showNight: event.target.checked })} />
            夜を表示する
          </label>
        </fieldset>
        <p className={styles.description}>午前・午後は常に表示します。朝を非表示にすると朝の予定は午前に、夜を非表示にすると夜の予定は午後に表示されます。</p>
        <p className={styles.description}>変更は自動で保存され、予定追加の選択肢にも反映されます。</p>
      </div>
    </div>
  );
}

export default Setting;
