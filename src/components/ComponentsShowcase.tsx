import {
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  DropdownItem,
  ToggleField,
  ProgressBarItem,
  TextField,
  SliderField,
  SteamSpinner,
  Tabs
} from '@decky/ui';
import { useState } from 'react';

export default function ComponentsShowcase() {
  const options = [
    { data: 0, label: "option1", value: 'option1' },
    { data: 1, label: "option2", value: 'option2' },
    { data: 2, label: "option3", value: 'option3' },
    { data: 3, label: "option4", value: 'option4' },
  ] as const;

  const [currentDropdownOption, setCurrentDropdownOption] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<string>("Tab1");
  const [currentText, setCurrentText] = useState<string>('');
  const [currentSliderValue, setCurrentSliderValue] = useState<number>(0);
  return (
    <PanelSection>
      <PanelSectionRow>
        <DropdownItem
          label="Dropdown"
          description="Dropdown description"
          menuLabel="MenuLabel"
          rgOptions={options.map((o) => ({
            data: o.data,
            label: o.label,
          }))}
          selectedOption={currentDropdownOption}
          onChange={(newVal: { data: number; label: string }) => {
              setCurrentDropdownOption(newVal.data)
          }}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <label>ToggleField component</label>
        <ToggleField
          label="ToggleField label"
          description="ToggleField description"
          checked={false}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <label>ButtonItem component</label>
        <ButtonItem
          label='ButtonItem label'
          description='ButtonItem description'>
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <label>ProgressBarItem</label>
        <ProgressBarItem
          label='ProgressBarItem label'
          description='ProgressBarItem description'
          nProgress={30}>
        </ProgressBarItem>
      </PanelSectionRow>


      <PanelSectionRow>
        <label>Textfield component</label>
        <TextField
          description='TextField description'
          placeholder='TextField placeholder'
          tooltip='TextField tooltip'
          value={currentText}
          onChange={e => setCurrentText(e.target.value)}>
        </TextField>
      </PanelSectionRow>

      <PanelSectionRow>
        <label>SliderField component</label>
        <SliderField
          label='SliderField label'
          value={currentSliderValue}
          onChange={e => setCurrentSliderValue(e)}
          >
        </SliderField>
      </PanelSectionRow>

      <PanelSectionRow>
        <label>Steam Spinner component</label>
        <SteamSpinner>
        </SteamSpinner>
      </PanelSectionRow>

      <PanelSectionRow>
        <label>Tabs component</label>
        <Tabs
          title="Theme Manager"
          activeTab={currentTab}
          onShowTab={(tabID: string) => {
            setCurrentTab(tabID);
          }}
          tabs={[
            {
              title: "Tab 1",
              content: <label>Tab1 content</label>,
              id: "Tab1",
            },
            {
              title: "Tab 2",
              content: <label>Tab2 content</label>,
              id: "Tab2",
            },
          ]}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
