import styles from './Setting.module.css';

function Setting({ periodSettings, onPeriodSettingsChange }) {
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
      </div>
    </div>
  );
}

export default Setting;
