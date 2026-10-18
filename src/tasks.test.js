import { test } from 'node:test';
import assert from 'node:assert/strict';
import { occursOn, tasksOnDate, toggleTask } from './tasks.js';

test('既存の予定と毎日の開始・終了日', () => {
    assert.equal(occursOn({ date: '2026-10-18' }, '2026-10-19'), false);
    const daily = { date: '2026-10-18', repeat: 'daily', endDate: '2026-10-20' };
    assert.equal(occursOn(daily, '2026-10-17'), false);
    assert.equal(occursOn(daily, '2026-10-18'), true);
    assert.equal(occursOn(daily, '2026-10-20'), true);
    assert.equal(occursOn(daily, '2026-10-21'), false);
});

test('指定曜日と年をまたぐ繰り返し', () => {
    const weekly = { date: '2026-10-18', repeat: 'weekly', weekdays: [0, 1] };
    assert.equal(occursOn(weekly, '2026-10-18'), true);
    assert.equal(occursOn(weekly, '2026-10-19'), true);
    assert.equal(occursOn(weekly, '2026-10-20'), false);
    assert.equal(occursOn(weekly, '2027-01-03'), true);
});

test('定期タスクの完了は日別、解除と保存後の復元', () => {
    const original = [{ id: 'a', date: '2026-10-18', repeat: 'daily' }];
    const checked = JSON.parse(JSON.stringify(toggleTask(original, 'a', '2026-10-18')));
    assert.equal(tasksOnDate(checked, '2026-10-18')[0].completed, true);
    assert.equal(tasksOnDate(checked, '2026-10-19')[0].completed, false);
    assert.equal(tasksOnDate(toggleTask(checked, 'a', '2026-10-18'), '2026-10-18')[0].completed, false);
    assert.equal(original[0].completedDates, undefined);
});

test('通常タスクの完了と解除、既存データの未完了表示', () => {
    const tasks = [{ id: 123, date: '2026-10-18' }];
    assert.equal(tasksOnDate(tasks, '2026-10-18')[0].completed, false);
    const checked = toggleTask(tasks, 123, '2026-10-18');
    assert.equal(tasksOnDate(checked, '2026-10-18')[0].completed, true);
    assert.equal(toggleTask(checked, 123, '2026-10-18')[0].completed, false);
});
