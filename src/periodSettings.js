export const DEFAULT_PERIOD_SETTINGS = { showMorning: false, showNight: false };
export const PERIOD_SETTINGS_KEY = 'periodSettings';

export function readPeriodSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(PERIOD_SETTINGS_KEY));
        return {
            showMorning: saved?.showMorning === true,
            showNight: saved?.showNight === true,
        };
    } catch {
        return { ...DEFAULT_PERIOD_SETTINGS };
    }
}
