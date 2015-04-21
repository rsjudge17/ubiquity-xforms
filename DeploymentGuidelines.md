# Introduction #

Using the Ubiquity libraries is as simple as adding a single script tag to an HTML or XHTML document, that refers to the Ubiquity loader. Since browsers will allow scripts to be returned from a different server to the one that the main document came from, then the most common deployment model for authors using the Ubiquity libraries will be to use the SVN repository itself. However, it is also possible to place all of the files on your own server, and run your scripts from there.

# Using the code from Google Code #

The live code for any of the Ubiquity libraries lives in the `tags` folder of the corresponding SVN repository. The sub-directory in `tags` is the name of the version, and the snapshot placed into this location _will never change_. If any bug-fixes are required, a new point release will be issued.

For example, version `0.3.0` of Ubiquity XForms is located at:
```
http://ubiquity-xforms.googlecode.com/svn/tags/0.3.0
```

# Creating your own deployment #

If you want to deploy the library to your own server, run the files locally, or distribute them with a desktop application, then you will need to take a copy from SVN. It's best to take a copy of a release from the `tags` directory, rather than the trunk.