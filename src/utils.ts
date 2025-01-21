export const minutesToDateTimeString = (totalMinutes: number) => {
    const hoursUntilAlarm = Math.trunc(totalMinutes / 60);
    const minutesUntilAlarm = totalMinutes % 60;
    return `${('00' + hoursUntilAlarm).slice(-2)}:${('00' + minutesUntilAlarm).slice(-2)}`
}