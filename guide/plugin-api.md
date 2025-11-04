# Plugin API

A plugin is a Swift package that implements a `PluginEntrypoint` function. This function is the entry point for your plugin and is called when the application starts. It receives a `PluginContext` object that contains information about the plugin and the application, and it returns a `PluginRegistration` object that you use to register your plugin's hooks.

## Plugin Distribution

To be used by a Vibekit application, your plugin must be compiled as a dynamic library (`.dylib`) file. Because Vibekit can run on different Mac architectures, it is crucial to build your plugin for both `arm64` (Apple Silicon) and `x86_64` (Intel) architectures. You can create a universal binary that contains both architectures using the `lipo` command-line tool.

## Installing a Plugin

To install a plugin, you simply place its directory inside the `Plugins` directory of your Vibekit application. The application will automatically discover and load any valid plugins it finds in this directory at startup.

A typical plugin directory contains the compiled `.dylib` file and a `plugin.json` manifest file.

```
my-awesome-blog/
├── Plugins/
│   └── MyLoggingPlugin/
│       ├── plugin.json
│       └── libMyLoggingPlugin.dylib
└── ...
```

## The `plugin.json` Manifest

The `plugin.json` file is a manifest that tells Vibekit how to load and use your plugin. It contains metadata about the plugin, its entry point, and any configuration it might need.

Here are the fields for the `plugin.json` file:

*   **`name`** (String, required): A unique name for your plugin.
*   **`packagePath`** (String, optional): The relative path to the Swift package that contains the plugin's source code. This is useful during development.
*   **`packageName`** (String, optional): The name of the Swift package.
*   **`product`** (String, required): The name of the Swift package product that is built.
*   **`entry`** (String, required): The name of the C-style entry point function in your plugin's code. This is the function that Vibekit will call to initialize the plugin.
*   **`library`** (String, optional): The name of the compiled dynamic library file (e.g., `libMyPlugin.dylib`). If not provided, Vibekit will attempt to find it based on the product name.
*   **`config`** (Object, optional): A dictionary of key-value pairs that provide default configuration for your plugin. This configuration is passed to your plugin's entry point in the `PluginContext` and can be used to control its behavior.


## Example Plugin

Here is an example of a plugin that logs a message every time a new `Thing` is created.

Create a Swift package for your plugin and add the following code to your main plugin file:

```swift
import Foundation
import PluginAPI

// The entry point for the plugin
@_cdecl("myLoggerPlugin_entry")
public func entry(context: PluginContext) -> PluginRegistration {
    var registration = PluginRegistration()

    // Create a new set of store hooks
    var storeHooks = StoreHooks()

    // Register a hook to be called after a Thing is created
    storeHooks.onDidCreate { context, record in
        let thingName = context.thing
        let thingId = record["id"] ?? "N/A"
        print("A new '\(thingName)' was created with ID: \(thingId)")
    }

    // Register the store hooks with the plugin registration
    registration.registerStoreHooks { _ in storeHooks }

    return registration
}
```

This plugin uses the `onDidCreate` hook to receive the `thing` name and the created `record`. It then prints a message to the console with this information. To use this plugin, you would compile it as a dynamic library and place it in your application's `Plugins` directory.


## Hook Categories

The Plugin API provides several categories of hooks that allow you to interact with different parts of the application:

*   **Store Hooks:** These hooks are called during the lifecycle of the data store. You can use them to intercept and modify data before it is created, updated, or deleted.
*   **Event Hooks:** These hooks are called when an event is appended to the event log. You can use them to perform actions before or after an event is processed.
*   **Theme Hooks:** These hooks are called during the theme rendering process. You can use them to inject custom HTML into your theme's templates.

## Store Hooks

Store hooks are registered using the `registerStoreHooks` function on the `PluginRegistration` object. The available store hooks are:

*   **`onBootstrap`:** Called when the data store is first initialized. You can use this hook to seed the data store with initial data.
*   **`onWillCreate`:** Called before a new `Thing` is created.
*   **`onDidCreate`:** Called after a new `Thing` has been created.
*   **`onWillApply`:** Called before an event is applied to a `Thing`.
*   **`onDidApply`:** Called after an event has been applied to a `Thing`.
*   **`onWillDelete`:** Called before a `Thing` is deleted.
*   **`onDidDelete`:** Called after a `Thing` has been deleted.

## Event Hooks

Event hooks are registered using the `registerEventHooks` function on the `PluginRegistration` object. The available event hooks are:

*   **`onBootstrap`:** Called when the event log is first initialized. You can use this hook to add initial events to the log.
*   **`onAppend`:** Called when a new event is appended to the log.

## Theme Hooks

Theme hooks are registered using the `registerThemeHooks` function on the `PluginRegistration` object. The available theme hooks are:

*   **`onBeforeRender`:** Called before a template is rendered.
*   **`onAfterRender`:** Called after a template has been rendered.
*   **`onBeforeSection`:** Called before a specific section of a template is rendered.
*   **`onAfterSection`:** Called after a specific section of a template has been rendered.
*   **`onThingList`:** Called when a list of `Things` is being rendered.
*   **`onThingItem`:** Called when an individual `Thing` in a list is being rendered.
*   **`onThingRecord`:** Called when a single `Thing` is being rendered on its own page.