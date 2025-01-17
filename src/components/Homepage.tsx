import {
  Tabs,
} from '@decky/ui';
import { useState } from 'react';
import AlarmTab from './AlarmTab';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<string>("playtime");
  return (
    <div style={{
      height: '800px',
      display: 'flex',
      justifyContent: 'space-evenly',
    }}>
      <Tabs
        title="Decky Alarm"
        activeTab={currentTab}
        onShowTab={(tabID: string) => {
          setCurrentTab(tabID);
        }}
        tabs={[
          {
            title: "Playtime Alarms",
            content: <AlarmTab
             isRegularAlarmTab={false} />,
            id: "playtime",
          },
          {
            title: "Regular Alarms",
            content: <AlarmTab
            isRegularAlarmTab={true} />,
            id: "regular",
          },
        ]}
      />
    </div>
  );
}
