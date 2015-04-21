# Introduction #

Applications will tend to have specific requirements for loading extensions to UX. For example, custom controls or any reusable extension functionality leveraging the UX library will need to be loaded on a per application basis, as and when needed.

# Design #

  * Don't want technique to be tied to JavaScript loading mechanism
  * Authors should be able to pull in extensions from their own locations

## Interim options ##

  * Use a canonical name for the custom loader - A canonical name for the custom loader can be defined. For example, `$UX/lib/extensions/loader.js` where `$UX` points to the corresponding SVN root (trunk or branch). This will be pulled in by the UX loading / build, placed as late as possible. By default, the custom loader at this location will be functionally empty. At the application level, this means the developer has to point to only one loader, i.e.

```
<script src="../ubiquity-loader.js">/**/</script>
```

  * Using separate custom loaders - This approach simply requires the extension developer to provide separate loaders for the extension(s). The application developer explicitly pulls in the bits and pieces needed. Again, the _basic_ UX loader is referenced first.

```
<script src="../ubiquity-loader.js">/**/</script>
<script src="../lib/extensions/yui-custom-controls/loader.js">/**/</script>
```