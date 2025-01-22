import {
    Button,
    PanelSectionRow,
    ToggleField
} from '@decky/ui';

export interface AlarmRowProps {
    textLabel: string,
    toggleValue: boolean,
    onToggle?(checked: boolean): void,
    isDeleting?: boolean,
    onDeleteClicked(): void,
};

export default function AlarmRow(props: AlarmRowProps) {
    return (<PanelSectionRow key={props.textLabel}>

        {
            <div style={{
                height:'50px',
                maxHeight:'50px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <label>{props.textLabel}</label>
            {props.isDeleting ?
                <Button
                    onClick={ _ => props.onDeleteClicked()}
                >
                    X
                </Button>
                : <ToggleField
                    checked={props.toggleValue}
                    onChange={props.onToggle}
                    bottomSeparator='none'
                />}
            </div>
        }
    </PanelSectionRow>);
};