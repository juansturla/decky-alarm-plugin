import { toaster } from '@decky/api';
import { getRegularAlarms, updateRegularAlarm } from './hooks/Cache'
import { minutesToDateTimeString } from './utils';

export class Timer {

  private static SECONDS_IN_A_DAY = 60 * 60 * 24;

  private static async getInterval(intervalInSeconds: number, callback: any): Promise<NodeJS.Timeout> {
    // get interval of frequency check
    let freq_ms = intervalInSeconds * 1_000;
    // make minimum update time 60 seconds
    freq_ms = freq_ms > 0 ? freq_ms : 60000
    let timer = setInterval(callback, freq_ms)

    return timer;
  }

  //=======
  // Regular alarm Section
  //======
  private static regularAlarmTimers: {
    [timeInSeconds: number]: NodeJS.Timeout;
  } = {};

  public static setRegularAlarmTimer = async (timeInMinutes: number, instantToast: boolean) => {
    const index = Object.keys(this.regularAlarmTimers).findIndex(item => item === timeInMinutes.toString());
    if (index !== -1) {
      return;
    }

    let alarmTotalMinutes = timeInMinutes;

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

    //clearInterval(this.timer);
    const callback = async () => {
      // Fire toast alarm
      toaster.toast({ title: 'Regular alarm !', body: minutesToDateTimeString(timeInMinutes) })
      clearInterval(this.regularAlarmTimers[timeInMinutes]);
      this.regularAlarmTimers[timeInMinutes] = await this.getInterval(this.SECONDS_IN_A_DAY, callback);
    };

    const intervalInSeconds = totalMinutesUntilAlarm * 60;
    this.regularAlarmTimers[timeInMinutes] = await this.getInterval(intervalInSeconds, callback);
    if (instantToast) {
      toaster.toast({ title: 'Alarm ready!', body: `Will sound in ${minutesToDateTimeString(totalMinutesUntilAlarm)}`})
      updateRegularAlarm(timeInMinutes, true);
    }
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

    // update
    updateRegularAlarm(timeInMinutes, false);
  }

  public static clearAllRegularAlarmTimers = async () => {
    Object.values(this.regularAlarmTimers)
      .forEach(timeout => clearInterval(timeout));
    this.regularAlarmTimers = {};
  }

  public static setupRegularAlarms() {
    (async () => {
      const regularAlarms = await getRegularAlarms();
      Object.entries(regularAlarms).map(
        ([key, value]) => {
          const keyAsInteger = Number.parseInt(key);
          if (value) {
            Timer.setRegularAlarmTimer(keyAsInteger, false);
          }
        }
      );
    })()
  }

  public static unsetupRegularAlarms() {
    (async () => {
      Timer.clearAllRegularAlarmTimers();
    })()
  }

  //=======
  // Playtime alarm Section
  //======

  private static playtimeAlarmTimers: {
    [minutes: number]: NodeJS.Timeout;
  } = {};

  //TODO
  public static setPlaytimeAlarmTimer = async (minutes: number) => {
    const index = Object.keys(this.playtimeAlarmTimers).findIndex(item => item === minutes.toString());
    if (index !== -1) {
      return;
    }
    const callback = async () => {
      // Fire toast alarm
      toaster.toast({ title: 'Playtime alarm !', body: 'Testing' })
    };
    this.playtimeAlarmTimers[minutes] = await this.getInterval(minutes * 60, callback);
  }
}