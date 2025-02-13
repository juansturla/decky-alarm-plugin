import {
  Tabs,
} from '@decky/ui';
import { useState } from 'react';
import AlarmTab from './AlarmTab';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<string>("regular");
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
            title: "Regular Alarms",
            content: <AlarmTab
            isRegularAlarmTab={true} />,
            id: "regular",
          },
          /* Not implemented yet
          {
            title: "Playtime Alarms",
            content: <AlarmTab
             isRegularAlarmTab={false} />,
            id: "playtime",
          },*/
        ]}
      />
    </div>
  );
}
