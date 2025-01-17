import {
    PanelSection,
    ToggleField
} from '@decky/ui';
import { useState } from 'react';
import { useRegularAlarm, usePlaytimeAlarm } from '../hooks/Cache'
import { Timer } from '../Timer'
import AlarmRow from './AlarmRow';


export interface AlarmTabProps {
    isRegularAlarmTab?: boolean,
    isDeleting?: boolean,
    onToggleDelete?(checked: boolean): void,
};

export default function AlarmTab(props: AlarmTabProps) {
    const [isDeletingAlarms, setIsDeletingAlarms] = useState<boolean>(false);

    if (props.isRegularAlarmTab) {
        return (<RegularAlarmTab
            isDeleting={isDeletingAlarms}
            onToggleDelete={e => {
                console.log(`Toggled Regular alarm Toggle new value is: ${e}`)
                setIsDeletingAlarms(e)
            }}
        />);
    } else {
        return (<PlaytimeAlarmTab
            isDeleting={isDeletingAlarms}
            onToggleDelete={e => {
                console.log(`Toggled Playtime alarm Toggle new value is: ${e}`)
                setIsDeletingAlarms(e)
            }}
        />);
    }
};

function toggleRegularAlarm(keyAsInteger:number,newValue:boolean) {
    if (newValue) {
        Timer.setRegularAlarmTimer(keyAsInteger);
    } else {
        // Deactivate existing alarm
        Timer.clearRegularAlarmTimer(keyAsInteger);
    }
}

export function RegularAlarmTab(props: AlarmTabProps) {
    console.log(`Rendering RegularAlarmTab props: isDeleting ? ${props.isDeleting} `);
    const regularAlarms = useRegularAlarm();
    const regularAlarmElements = Object.entries(regularAlarms).map(
        ([key, value]) => {
            const keyAsInteger = Number.parseInt(key);
            console.log(`Creating regularAlarmElements alarm key: ${key} and value ${value}`);
            if (value) {
                Timer.setRegularAlarmTimer(keyAsInteger);
            }
            const hours = Math.trunc(keyAsInteger / 60);
            const minutes = keyAsInteger % 60;

            return (<AlarmRow
                textLabel={`${('00'+hours).slice(-2)}:${('00'+minutes).slice(-2)}`}
                toggleValue={value}
                isDeleting={props.isDeleting}
                onToggle={e => toggleRegularAlarm(keyAsInteger, e)}
            />);
        }
    );
    return (
        <PanelSection>
            {regularAlarmElements}
            <ToggleField
                label='IsDeleting ?'
                checked={props.isDeleting || false}
                onChange={props.onToggleDelete}
            />
        </PanelSection>
    );
}

export function PlaytimeAlarmTab(props: AlarmTabProps) {
    console.log(`Rendering PlaytimeAlarmTab props: isDeleting ? ${props.isDeleting} `);

    const playtimeAlarms = usePlaytimeAlarm();
    const playtimeAlarmsElements = Object.entries(playtimeAlarms).map(
        ([key, value]) => {
            console.log(`Creating playtime alarm key: ${key} and value ${value}`);
            if (value) {
                Timer.setPlaytimeAlarmTimer(Number.parseInt(key));
            }

            return (<AlarmRow
                textLabel={`Every ${key} minutes`}
                toggleValue={value}
                isDeleting={props.isDeleting}
            />);
        }
    )
    return (
        <PanelSection>
            {playtimeAlarmsElements}
            <ToggleField
                label='IsDeleting ?'
                checked={props.isDeleting || false}
                onChange={props.onToggleDelete}
            />
        </PanelSection>
    );
}