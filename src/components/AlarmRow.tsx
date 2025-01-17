import {
    Button,
    ButtonItem,
    PanelSectionRow,
    ToggleField
} from '@decky/ui';

export interface AlarmRowProps {
    textLabel: string,
    toggleValue: boolean,
    onToggle?(checked: boolean): void,
    isDeleting?: boolean,
};

export default function AlarmRow(props: AlarmRowProps) {
    return (<PanelSectionRow key={props.textLabel}>
        <ToggleField
            label={props.textLabel}
            checked={props.toggleValue}
            onChange={props.onToggle}
        />
        {
            props.isDeleting ??
            <ButtonItem>
                DELETE
            </ButtonItem>
        }
    </PanelSectionRow>);;
};