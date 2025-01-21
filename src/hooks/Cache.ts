import localforage from 'localforage';
import { useState, useEffect } from 'react';

const database = 'decky-alarm';
export const playtimeKey = 'alarm-playtimes';
export const regularAlarmsKey = 'alarm-alarms';

export interface PlaytimeAlarmDict {
    [minutes: number]: boolean;
}

export interface RegularAlarmDict {
    [timeInMinutes: number]: boolean;
}

localforage.config({
    name: database,
});

export async function updateCache<T>(key: string, value: T) {
    await localforage.setItem(key, value);
}

const samplePlaytimeAlarms = {
    [30]: false,
    [60]: false,
}

// In minutes also
const sampleRegularAlarms = {
    [0]: true, //00:00
    [150]: true, //02:30am
    [480]: false, //8:00am
}

// TODO: Implement this
// export async function setPlaytimeAlarms --> Replace all alarms
// export async function setRegularAlarms --> Replace all alarms

// export async function addPlaytimeAlarms --> Get current alarms and add new one
// export async function addRegularAlarms --> Get current alarms and add new one
export async function addRegularAlarm(minutes:number): Promise<boolean> {
    const currentAlarms = await getRegularAlarms();

    const index = Object.keys(currentAlarms).findIndex(item => item === minutes.toString());
    // Key already exists
    if (index !== -1) {
      return false;
    }

    currentAlarms[minutes] = true;
    await localforage.setItem<RegularAlarmDict>(regularAlarmsKey, currentAlarms);
    return true;
}

export async function updateRegularAlarm(minutes:number, newValue:boolean): Promise<boolean> {
    const currentAlarms = await getRegularAlarms();
    const index = Object.keys(currentAlarms).findIndex(item => item === minutes.toString());
    // Key doesn't exists
    if (index === -1) {
      return false;
    }

    currentAlarms[minutes] = newValue;
    await localforage.setItem<RegularAlarmDict>(regularAlarmsKey, currentAlarms);
    return true;
}



export const useRegularAlarm = () => {
    const [regularAlarms, setRegularAlarms] = useState<RegularAlarmDict>({});
    useEffect(() => {
        const getData = async () => {
            setRegularAlarms(await getRegularAlarms());
        };
        getData();
    }, []);

    return regularAlarms;
};

export const usePlaytimeAlarm = () => {
    const [playtimeAlarms, setPlaytimeAlarms] = useState<PlaytimeAlarmDict>({});
    useEffect(() => {
        const getData = async () => {
            setPlaytimeAlarms(await getPlaytimeAlarms());
        };
        getData();
    }, []);

    return playtimeAlarms;
};

export async function getCache<T>(key: string): Promise<T | null> {
    return await localforage.getItem<T>(key);
}

export async function getPlaytimeAlarms(): Promise<PlaytimeAlarmDict> {
    const alarms = await localforage.getItem<PlaytimeAlarmDict>(playtimeKey);
    if (!alarms) {
        await localforage.setItem<PlaytimeAlarmDict>(playtimeKey, samplePlaytimeAlarms);
    }
    return alarms === null ? samplePlaytimeAlarms : alarms;
}

export async function getRegularAlarms(): Promise<RegularAlarmDict> {
    const alarms = await localforage.getItem<RegularAlarmDict>(regularAlarmsKey);
    if (!alarms) {
        await localforage.setItem<RegularAlarmDict>(regularAlarmsKey, sampleRegularAlarms)
    }
    return alarms === null ? sampleRegularAlarms : alarms
}

export const clearCache = () => {
    localforage.clear();
};
