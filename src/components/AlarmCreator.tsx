import {
    Button,
    ButtonItem,
    PanelSectionRow,
    TextField,
} from '@decky/ui';
import { useState } from 'react';
import { addRegularAlarm } from '../hooks/Cache';
import { Timer } from '../Timer';

export interface AlarmCreatorProps {
    onNewAlarmCreated?(): void,
};

export default function AlarmCreator(props: AlarmCreatorProps) {
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);

    const setMinutesWrapper = (newMinutes: number) => {
        if (newMinutes < 0) {
            setMinutes(55)
        } else if (newMinutes >= 60) {
            setMinutes(0)
        } else {
            setMinutes(newMinutes)
        }
    }

    const seHoursWrapper = (newHours: number) => {
        if (newHours < 0) {
            setHours(23)
        } else if (newHours >= 24) {
            setHours(0)
        } else {
            setHours(newHours)
        }
    }

    return (
        <PanelSectionRow>
            <label>
                Hours
            </label>
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
            }}>

                <Button
                    onClick={_ => seHoursWrapper(hours - 1)}>
                    -
                </Button>
                <TextField
                    disabled={true}
                    rangeMin={0}
                    rangeMax={24}
                    mustBeNumeric={true}
                    value={hours.toString()}>
                </TextField>
                <Button
                    onClick={_ => seHoursWrapper(hours + 1)}>
                    +
                </Button>
            </div>
            <label>
                Minutes
            </label>
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
            }}>

                <Button
                    onClick={_ => setMinutesWrapper(minutes - 5)}>
                    -
                </Button>
                <TextField
                    disabled={true}
                    mustBeNumeric={true}
                    rangeMin={0}
                    rangeMax={60}
                    value={minutes.toString()}>
                </TextField>
                <Button
                    onClick={_ => setMinutesWrapper(minutes + 5)}>
                    +
                </Button>
            </div>
            <ButtonItem
                onClick={_ => createNewAlarm(hours, minutes, props)}>
                Create alarm
            </ButtonItem>
        </PanelSectionRow>
    );
};

async function createNewAlarm(hours: number, minutes: number, props: AlarmCreatorProps) {
    const totalMinutes = hours * 60 + minutes;
    // Save alarm in cache
    const result = await addRegularAlarm(totalMinutes);
    // Initialize alarm
    if (result) {
        await Timer.setRegularAlarmTimer(totalMinutes, true);
        if (props.onNewAlarmCreated != null) {
            props.onNewAlarmCreated();
        }
    }
}