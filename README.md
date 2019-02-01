# Geppetto Application

This module contains a template to create Geppetto applications.

### Quick start

- Clone this repository into your application root directory.
- Use `GeppettoConfiguration.json` to pass properties to the underlying Geppetto client.
- Check [here](https://github.com/openworm/geppetto-client/blob/wip/package.json) the npm packages that are already installed when you start to build a new Geppetto application.
- Edit `ComponentInitialization.js` to bring your App.js custom file.
- Create a bundle file by runing `npm run build-dev-noTest`.

#### If you want to install Geppetto client in development mode, follow this steps:

- Clone [geppetto-client](https://github.com/openworm/geppetto-client.git).
- Run `npm install` inside `geppetto-client`.
- Install `link` globally (if you don't have it already).
- Run `sudo npm link` inside `geppetto-client`.
- Go to your Geppetto appliation root directory (for instance: geppetto-application) and run `npm link`.
- Run `npm run build-dev-noTest:watch` inside your Geppetto application and then both geppetto application/client files will be watched.



For information about how this fits into [Geppetto](http://www.geppetto.org/) refer to the umbrella project [org.geppetto](https://github.com/openworm/org.geppetto) on GitHub.