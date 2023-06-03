# AdminiMap

**AdminiMap** is a travel blogging platform with an interactive map showing all the trips taken by users. A simple and lightweight app using Pigeon Maps and custom CSS. ASP.NET Core project to act as an API backend and a React project to act as the UI.

## Demo

![](https://github.com/komarowski/AdminiMap/blob/main/images/demo.gif)

## Description

### Features

 - The Markdown markup language is used for writing articles.
 - Uses Pigeon Maps to display articles on a map.
 - Responsive design with custom css.

### Structure

 - AdminiMapBackend - ASP.NET Core 6 minimal API
 - adminimapfrontend - React with [Pigeon Maps](https://pigeon-maps.js.org/)

## Getting Started

### Debug

1. Clone the repository
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run AdminiMap.sln in Visual Studio 2022
4. Set up a proxy server in `setupProxy.js` to match the `applicationUrl` property in `launchSettings.json`.
	```js
	const appProxy = createProxyMiddleware('/api', {
        target: 'https://localhost:7126',  // update the target
        secure: false,
    });
   ```
5. Run adminimapfrontend project in Visual Studio Code

## Conventions

The `AdminiMapBackend/MarkdownFiles` folder contains test files.

## Roadmap

- [ ] Improve search
	- [ ] Add search by tags
	- [ ] Navigating search suggestions using the keyboard
	- [ ] Improve performance with cache
- [ ] Add admin panel
    - [ ] Add authorization
	- [ ] Add CRUD operations for blog
	- [ ] Add multi-user support
- [ ] Add different marker icons
