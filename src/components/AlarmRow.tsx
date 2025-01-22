import {
    ButtonItem,
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
            props.isDeleting ?
                <ButtonItem
                    label={props.textLabel}
                    onClick={ _ => props.onDeleteClicked()}
                >
                    X
                </ButtonItem>
                : <ToggleField
                    label={props.textLabel}
                    checked={props.toggleValue}
                    onChange={props.onToggle}
                />
        }
    </PanelSectionRow>);;
};