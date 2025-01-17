import { definePlugin, staticClasses } from '@decky/ui';
import { routerHook } from '@decky/api';
import { FaRegClock } from 'react-icons/fa';
import { LoadingScreen } from './components/LoadingScreen';
import ComponentsShowcase from './components/ComponentsShowcase';
import HomePage from './components/Homepage';
import { Timer } from './Timer';

export default definePlugin(() => {
    //const libraryContextMenuPatch = contextMenuPatch(LibraryContextMenu);
    //const libraryAppPagePatch = patchAppPage();
    routerHook.addRoute('/decky-alarm/loading', LoadingScreen);
    Timer.setupRegularAlarms();

    return {
        title: <div className={staticClasses.Title}>Decky Alarm</div>,
        icon: <FaRegClock />,
        content: <HomePage />,
        onDismount() {
            //libraryContextMenuPatch?.unpatch();
            //routerHook.removePatch('/library/app/:appid', libraryAppPagePatch);
            Timer.unsetupRegularAlarms();

            routerHook.removeRoute('/decky-alarm/loading');
        },
    };
});
