// Type definitions for WebExtensions
// Project: WebExtensions
// Definitions by: Mohammed Hamdy <https://github.com/github-account-because-they-want-it>


declare namespace browser {

    namespace storage {
        interface StorageArea {
            /**
             * Retrieves one or more items from the storage area.
             * @param keys A key (string) or keys (an array of strings or objects) to identify the item(s) to be retrieved from storage.
             * If you pass an empty string or array here, an empty object will be retrieved.
             * If you pass null here the entire storage contents will be retrieved.
             */
            get<T>(keys?: string | string[] | any[]): Promise<T>;
            /**
             * Gets the amount of storage space, in bytes, used one or more items being stored in the storage area.
             */
            getBytesInUse(keys: string | string[] | any[]): Promise<number>;
            /**
             * Stores one or more items in the storage area, or update existing items.
             * @param keys An object containing one or more key/value pairs to be stored in storage. If an item already exists, its value will be updated.
             * Primitive values (such as numbers) and arrays will serialize as expected.
             * Functions will be omitted.
             * Dates, and Regexes will serialize using their String representation.
             */
            set(keys: Object): Promise<void>;
            /**
             * Removes one or more items from the storage area.
             */
            remove(keys: string | string[]): Promise<void>;
            /**
             * Removes all items from the storage area
             */
            clear(): Promise<void>;
        }
        const sync: StorageArea;
        const local: StorageArea;
    }

    /**
     * A browser action is a button in the browser's toolbar
     */
    interface BrowserAction {

        /**
         * Enables the browser action for a tab
         */
        enable(tabId?: number): void;

        /**
         * Disables the browser action for a tab, meaning that it cannot be clicked when that tab is active
         */
        disable(tabId?: number): void;

        /**
         * Gets the browser action's title
         * @param details.tabId Specify the tab to get the title from. 
         * If this is omitted or does not match the ID of an open tab, the non-tab-specific title is returned
         */
         getTitle(details: {tabId?: number}): Promise<string>;

        /**
         * Sets the browser action's title. The title is displayed in a tooltip over the browser action's icon.
         * You can pass a tabId in as an optional parameter — if you do this then the title is changed only for the given tab
         * @param details.title The string the browser action should display when moused over
         * @param details.tabId Sets the title only for the given tab. The title is reset automatically when the tab is closed
         */
        setTitle(details: {title: string, tabId?: number}): void;
        
        /**
         * Sets the icon for the browser action
         * @param details.imageData Use a dictionary object to specify multiple ImageData objects in different sizes,
         * so the icon does not have to be scaled for a device with a different pixel density. 
         * If imageData is a dictionary, the value of each property is an ImageData object, and its name is its size.
         * @param path This is either a relative path to an icon file or it is a dictionary object
         */
        setIcon(details: {imageData?: ImageData | Object, path?: string | Object}): Promise<void>;

        /**
         * Gets the HTML document set as the popup for this browser action.
         */
        getPopup(details?: {tabId?: number}): Promise<string>;

        /**
         * Sets the HTML document that will be opened as a popup when the user clicks on the browser action's icon
         * @param details.popup The HTML file to show in a popup, specified as a URL
         */
        setPopup(details: {tabId?: number, popup: string}): void;

        /**
         * Gets the browser action's badge text
         */
         getBadgeText(details?: {tabId?: number}): Promise<string>;
        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon
         */
        setBadgeText(details: {text: string, tabId?: number}): void;

        /**
         * Gets the background color of the browser action's badge
         */
         getBadgeBackgroundColor(details: {tabId?: number}): Promise<ColorArray>;

        /**
         * Sets the background color for the badge
         */
        setBadgeBackgroundColor(details: {tabId: number, color: string | ColorArray})

        /**
        * Fired when a browser action icon is clicked. This event will not fire if the browser action has a popup
        */
        onClicked: BrowserActionEventListener;
    }

    /**
     * This module provides information about your add-on and the environment it's running in
     */
     interface Runtime {
        /**
         * Given a relative path from the manifest.json to a resource packaged with the add-on, return a fully-qualified URL
         */
        getURL(path: string): string;

        /**
         * Get the complete manifest.json file, serialized to a JSON object
         */
        getManifest(): any;

        /**
         * Sends a single message to event listeners within your extension or a different extension
         */
        sendMessage<T>(message?: any, includeTlsChannelId?: boolean): Promise<T>;
        sendMessage<T>(extensionId?: string, message?: any, includeTlsChannelId?: boolean): Promise<T>;

        /**
         * Use this event to listen for messages from another part of your add-on
         */
        onMessage: MessageListener;
     }

     /**
      * Display notifications to the user, using the underlying operating system's notification mechanism
      */
      interface Notification {
          /**
           * Creates and displays a notification
           * @param id This is used to refer to this notification in notifications.update(), notifications.clear(), and event listeners.
           * If you omit this argument or pass an empty string, then a new ID will be generated for this notification.
           * If the ID you provide matches the ID of an existing notification from this add-on, then the other notification will be cleared.
           */
          create(options: NotificationOptions, id?: string): Promise<string>;
      }

    /**
     * An array of four integers in the range 0-255, defining an RGBA color
     */
    interface ColorArray {
        [index: number]: number;
    }

    interface BrowserActionEventListener {
        addListener(listener: (tab: Tab) => void): void;
        removeListener(listener: (tab: Tab) => void): void;
        hasListener(listener: (tab: Tab) => void): boolean;
    }

    /**
     * Defines the notification's content and behavior.
     */
    interface NotificationOptions {
        type: TemplateType;
        message: string;
        title: string;
        iconUrl?: string;
        contextMessage?: string;
        priority?: number;
        eventTime?: number;
        buttons?: NotificationButton[];
        imageUrl?: string;
        items?: NotificationItem[];
        progress?: number;
    }
    type TemplateType = "basic" | "image" | "list" | "progress"
    
    interface NotificationButton {
        title: string;
        iconUrl?: string;
    }

    interface NotificationItem {
        title: string;
        message: string;
    }

    interface TabNS {
        /**
         * Creates a new tab
         */
        create(createProperties: {active?: boolean, cookieStoreId?: string, index?: number, openerTabId?: number,
            pinned?: boolean, url?: string, windowId?: number}): Promise<Tab>;

        executeScript(tabId: number, details: InjectDetails): Promise<any[]>;

        /**
         * Sends a single message from the add-on's background scripts 
         * (or other privileged scripts, such as popup scripts or options page scripts) 
         * to any content scripts that belong to this add-on and are running in the specified tab
         */
        sendMessage<Response>(tabId: number, message: any, options?: {frameId: number}): Promise<Response>
        
        onUpdated: TabUpdateEventListener;
        
        /**
         * Closes one or more tabs
         */
        remove(tabIds: number | number[]): Promise<string>;

        /**
         * Fired when a tab is closed
         */
        onRemoved: TabRemovedEventListener
    }

    interface Tab {
        active: boolean;
        audible?: boolean;
        cookieStoreId?: string;
        favIconUrl?: string;
        height?: number;
        highlighted: boolean;
        id?: number;
        incognito: boolean;
        index: number;
        mutedInfo?: MutedInfo;
        openerTabId?: number;
        pinned: boolean;
        selected: boolean;
        sessionId?: string;
        status?: string;
        title?: string;
        url?: string;
        width?: number;
        windowId: number;
    }

    interface TabUpdateEventListener {
        addListener(listener:  (tabId: number, changeInfo: ChangeInfo, tab: Tab) => void): void;
        removeListener(listener: Function): void;
        hasListener(listener: Function): void;
    }

    interface TabRemovedEventListener {
        addListener(callback: (tabId: number, removeInfo: {windowId: number, isWindowClosing: boolean}) => void);
        removeListener(listener: Function);
        hasListener(listener: Function): boolean;
    }

    interface MessageListener {
        addListener(listener: (message: any, sender: MessageSender, sendResponse: (response: any) => void) => void): void
        removeEventListener(listener: Function): void;
        hasListener(listener: Function): boolean;
    }

    interface InjectDetails {
        allFrames?: boolean;
        code?: string;
        file?: string;
        frameId?: number;
        matchAboutBlank?: boolean;
        runAt?: "document_start" | "document_end" | "document_idle";
    }

    interface MutedInfo {
        extensionId?: string;
        muted: boolean;
        reason?: string; 
    }

    interface ChangeInfo {
        status?: "loading" | "complete";
        url?: string;
        pinned?: boolean;
        audible?: boolean;
        mutedInfo?: MutedInfo;
        favIconUrl?: string;
    }

    interface MessageSender {
        tab?: Tab;
        frameId?: number;
        id?: string;
        url?: string;
        tlsChannelId?: string;
    }

    const browserAction: BrowserAction;
    const runtime: Runtime;
    const notifications: Notification;
    const tabs: TabNS;
}