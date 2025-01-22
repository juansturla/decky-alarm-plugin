import {
    PanelSection,
    ToggleField
} from '@decky/ui';
import { useEffect, useState } from 'react';
import { useRegularAlarm, usePlaytimeAlarm, RegularAlarmDict } from '../hooks/Cache'
import { Timer } from '../Timer'
import AlarmCreator from './AlarmCreator';
import AlarmRow from './AlarmRow';
import { minutesToDateTimeString } from '../utils';

export interface AlarmTabProps {
    isRegularAlarmTab?: boolean,
    isDeleting?: boolean,
    onToggleDelete?(checked: boolean): void,
    onNewAlarmCreated?(): void,
};

export default function AlarmTab(props: AlarmTabProps) {
    const [isDeletingAlarms, setIsDeletingAlarms] = useState<boolean>(false);
    const [reRenderFlag, setReRenderFlag] = useState<boolean>(false);
    props.onNewAlarmCreated = () => {
        setReRenderFlag(!reRenderFlag);
    }

    if (props.isRegularAlarmTab) {
        return (<RegularAlarmTab
            isDeleting={isDeletingAlarms}
            onToggleDelete={e => {
                console.log(`Toggled Regular alarm Toggle new value is: ${e}`)
                setIsDeletingAlarms(e)
            }}
            onNewAlarmCreated={props.onNewAlarmCreated}
        />);
    } else {
        return (<PlaytimeAlarmTab
            isDeleting={isDeletingAlarms}
            onToggleDelete={e => {
                console.log(`Toggled Playtime alarm Toggle new value is: ${e}`)
                setIsDeletingAlarms(e)
            }}
            onNewAlarmCreated={props.onNewAlarmCreated}
        />);
    }
};

function toggleRegularAlarm(keyAsInteger:number,newValue:boolean) {
    if (newValue) {
        Timer.setRegularAlarmTimer(keyAsInteger, true);
    } else {
        // Deactivate existing alarm
        Timer.clearRegularAlarmTimer(keyAsInteger);
    }
}

async function deleteRegularAlarm(keyAsInteger: number) {
    await Timer.deleteRegularAlarm(keyAsInteger);
}

export function RegularAlarmTab(props: AlarmTabProps) {
    const [reRenderFlag, setReRenderFlag] = useState<boolean>(false);
    const onNewAlarmCreated = () => {
        const newValue = !reRenderFlag;
        setReRenderFlag(newValue);
    };
    props.onNewAlarmCreated = onNewAlarmCreated
    const regularAlarms = useRegularAlarm();
    console.log(`Rendering RegularAlarmTab props: isDeleting ? ${props.isDeleting}. Alarms ${Object.keys(regularAlarms).length} `);
    const regularAlarmElements = Object.entries(regularAlarms).map(
        ([key, value]) => {
            const keyAsInteger = Number.parseInt(key);
            if (value) {
                Timer.setRegularAlarmTimer(keyAsInteger, false);
            }

            return (
                <AlarmRow
                    isDeleting={props.isDeleting}
                    onToggle={async e => await toggleRegularAlarm(keyAsInteger, e)}
                    onDeleteClicked={() => {
                        deleteRegularAlarm(keyAsInteger)
                            .then(onNewAlarmCreated);
                    }}
                    textLabel={minutesToDateTimeString(keyAsInteger)}
                    toggleValue={value}
                />
            );
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
            <AlarmCreator
                onNewAlarmCreated={() => {
                    props.onNewAlarmCreated?.()
                    onNewAlarmCreated()
                }}
            />
        </PanelSection>
    );
}

export function PlaytimeAlarmTab(props: AlarmTabProps) {
    console.log(`Rendering PlaytimeAlarmTab props: isDeleting ? ${props.isDeleting} `);

    const playtimeAlarms = usePlaytimeAlarm();
    const playtimeAlarmsElements = Object.entries(playtimeAlarms).map(
        ([key, value]) => {
            const keyAsInteger = Number.parseInt(key);
            console.log(`Creating playtime alarm key: ${key} and value ${value}`);
            if (value) {
                Timer.setPlaytimeAlarmTimer(Number.parseInt(key));
            }

            return (
                <AlarmRow
                    isDeleting={props.isDeleting}
                    onToggle={e => toggleRegularAlarm(keyAsInteger, e)}
                    onDeleteClicked={async() => {
                        await deleteRegularAlarm(keyAsInteger);
                        //onNewAlarmCreated();
                    }}
                    textLabel={`Every ${key} minutes`}
                    toggleValue={value}
                />
            );
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