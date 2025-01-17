import { toaster } from '@decky/api';
import { clear } from 'localforage';
import { useRegularAlarm, usePlaytimeAlarm, getRegularAlarms } from './hooks/Cache'

export class Timer {

  private static SECONDS_IN_A_DAY = 60 * 60 * 24;

  private static playtimeAlarmTimers: {
    [minutes: number]: NodeJS.Timeout;
  } = {};
  private static regularAlarmTimers: {
    [timeInSeconds: number]: NodeJS.Timeout;
  } = {};

  public static setPlaytimeAlarmTimer = async (minutes: number) => {
    const index = Object.keys(this.playtimeAlarmTimers).findIndex(item => item === minutes.toString());
    if (index !== -1) {
      return;
    }
    //clearInterval(this.timer);
    const callback = async () => {
      // Fire toast alarm
      toaster.toast({ title: 'Playtime alarm !', body: 'Testing' })

    };
    this.playtimeAlarmTimers[minutes] = await this.getInterval(minutes * 60, callback);
  }

  public static setRegularAlarmTimer = async (timeInMinutes: number) => {
    const index = Object.keys(this.regularAlarmTimers).findIndex(item => item === timeInMinutes.toString());
    if (index !== -1) {
      return;
    }

    const hours = Math.trunc(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    let alarmTotalMinutes = hours * 60 + minutes;

    const now = new Date();
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();
    const nowTotalMinutes = nowHours * 60 + nowMinutes;

    // Alarm will sound tomorrow
    if (nowTotalMinutes > alarmTotalMinutes) {
      alarmTotalMinutes += 24 * 60;
    } else {
      // Will sound today
    }

    const totalMinutesUntilAlarm = alarmTotalMinutes - nowTotalMinutes;

    const hoursUntilAlarm = Math.trunc(totalMinutesUntilAlarm / 60);
    const minutesUntilAlarm = totalMinutesUntilAlarm % 60;

    //clearInterval(this.timer);
    const callback = async () => {
      // Fire toast alarm
      toaster.toast({ title: 'Regular alarm !', body: `${hours}:${minutes}` })
      clearInterval(this.regularAlarmTimers[timeInMinutes]);
      this.regularAlarmTimers[timeInMinutes] = await this.getInterval(this.SECONDS_IN_A_DAY, callback);

    };

    const intervalInSeconds = totalMinutesUntilAlarm * 60;
    this.regularAlarmTimers[timeInMinutes] = await this.getInterval(intervalInSeconds, callback);

    toaster.toast({ title: 'Alarm ready!', body: `Will sound in ${('00'+hoursUntilAlarm).slice(-2)}:${('00'+minutesUntilAlarm).slice(-2)}` })
  }

  public static clearRegularAlarmTimer = async (timeInMinutes: number) => {
    console.log(`Deactivating regular alarm timer for key ${timeInMinutes}`)
    const index = Object.keys(this.regularAlarmTimers).findIndex(item => item === timeInMinutes.toString());
    if (index === -1) {
      console.log(`Couldn't find regular alarm for key ${timeInMinutes}`)
      return;
    }
    clearInterval(this.regularAlarmTimers[timeInMinutes]);
    delete this.regularAlarmTimers[timeInMinutes];
  }

  private static async getInterval(intervalInSeconds: number, callback: any): Promise<NodeJS.Timeout> {
    // get interval of frequency check
    let freq_ms = intervalInSeconds * 1_000;
    // make minimum update time 60 seconds
    freq_ms = freq_ms > 0 ? freq_ms : 60000
    let timer = setInterval(callback, freq_ms)

    return timer;
  }

  public static setupRegularAlarms() {
    (async () => {
      const regularAlarms = await getRegularAlarms();
      Object.entries(regularAlarms).map(
        ([key, value]) => {
            const keyAsInteger = Number.parseInt(key);
            if (value) {
                Timer.setRegularAlarmTimer(keyAsInteger);
            }
        }
    );
    })()
  }

  public static unsetupRegularAlarms() {
    (async () => {
      const regularAlarms = await getRegularAlarms();
      Object.entries(regularAlarms).map(
        ([key, value]) => {
            const keyAsInteger = Number.parseInt(key);
            if (value) {
                Timer.clearRegularAlarmTimer(keyAsInteger);
            }
        }
    );
    })()
  }
}