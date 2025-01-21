import { definePlugin, staticClasses } from '@decky/ui';
import { FaRegClock } from 'react-icons/fa';
import HomePage from './components/Homepage';
import { Timer } from './Timer';

interface SteamHook {
    unregister: () => void
}

export default definePlugin(() => {
    const activeHooks: SteamHook[] = [];

    Timer.setupRegularAlarms();

    activeHooks.push(
        SteamClient.System.RegisterForOnResumeFromSuspend(async () => {
            Timer.unsetupRegularAlarms();
            Timer.setupRegularAlarms();
        })
    );

    return {
        title: <div className={staticClasses.Title}>Decky Alarm</div>,
        icon: <FaRegClock />,
        content: <HomePage />,
        onDismount() {
            Timer.unsetupRegularAlarms();
            activeHooks.forEach((it) => it.unregister())
        },
    };
});
