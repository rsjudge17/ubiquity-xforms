# Introduction #

It's fairly straightforward to create a Buildbot slave that will connect to the Ubiquity XForms Buildbot master. This page captures notes on the process, and will apply to any Buildbot slave. If you specifically want to set up a slave that talks to the Ubiquity XForms master then you'll need to obtain a slave name, and let us know the user-name and password. You'll also need to decide what it is that you are going to test, so that the Buildbot master can send the correct commands to your slave.

You can do all of this by contacting [Mark Birbeck](mailto:mark.birbeck@webBackplane.com).

For the purposes of this tutorial, let's assume that the slave is called `wbp-vista-1`, which indicates that the slave is running in the Backplane offices, and a Windows Vista machine.

# Details #

## Install Python ##

The latest versions of Python are on the [Python download page](http://www.python.org/download/). The Windows installers for version 2.x are recommended over version 3 installers. At the time of writing the latest was version 2.6.1.

Add the Python (`c:\Python26\`) and Python scripts (`c:\Python26\Scripts\`) directories to `PATH` in the environment variables.

Also add `.PY` to `PATHEXT`.

Open a new command prompt (an existing one won't have the new entries in the environment variables) and verify that you can run Python:
```
python --version
```

You should see version 2.6.1, but if you don't, type `set` and ensure that the changes to `PATH` and `PATHEXT` are showing up.

## Install Python Extensions for Windows ##

The latest versions of PyWin32 are on the [pywin32 Sourceforge.net page](http://sourceforge.net/project/platformdownload.php?group_id=78018&sel_platform=3212). Choose a version that matches the version of Python installed in the first step, which in this case is PyWin32 build 212 for Python 2.6.

## Install Twisted ##

The latest versions of Twisted are on the [Twisted Matrix Labs trac page](http://twistedmatrix.com/trac/). Choose a version of Twisted that matches the version of Python installed in the previous step, which in this case is Twisted 8.2.0 for Python 2.6.

Open a new command prompt and verify that you can run Twisted:
```
trial --version
```

You should see version 8.2.0.

## Install Buildbot ##

ASCEND has a [Windows installer](http://ascendwiki.cheme.cmu.edu/images/0/0f/Buildbot-0.7.6.win32.exe) that installs Buildbot. It's only version 0.7.6 but it seems to work ok.

NOTE: When using the ASCEND installer, you are required to have the MSVCR71.dll available in a directory that is in your `PATH`.

Alternatively, you can [download a more recent version from SourceForge](http://sourceforge.net/project/showfiles.php?group_id=73177) and build it yourself. This is simply a matter of running the setup.py python script in the root of the buildbot directory a couple of times. First with the argument `build` and then again with the argument `install`.

If you choose to use the ASCEND installer, you will need to modify the `buildbot.bat` file in the Python scripts directory to refer to the correct version of Python. Assuming that Python 2.6 is being used, then the file will be found here (you don't have to do this if you've built BuildBot yourself):
```
c:\Python26\scripts\buildbot.bat
```
and will contain this:
```
@python C:\Python23\Scripts\buildbot %*
```
which should be changed to:
```
@python C:\Python26\Scripts\buildbot %*
```

Next, the Buildbot startup file -- `startup.py` -- needs to be modified due to a problem with Twisted. The file should be here:
```
c:\Python26\Lib\site-packages\buildbot\scripts\startup.py
```
Replace the lines beginning at line 108, with:
```
        if platformType == "win32":
            try:
                from twisted.scripts._twistw import run
            except ImportError:
                from twisted.scripts.twistd import run
        else:
            from twisted.scripts.twistd import run
        run()
```

Verify that you can run Buildbot:
```
buildbot --version
```
You should see that Buildbot has version 0.7.6, and that Twisted has version 8.2.0.

Create a directory to hold the Buildbot slave (or slaves) at:
```
c:\Documents and Settings\buildbot
```

## Install SVN ##

The latest versions of SVN for Windows are available from the [Tigris.org Windows download page](http://subversion.tigris.org/servlets/ProjectDocumentList?folderID=91). Use the latest MSI that contains the basic Win32 binaries (currently 1.5.3).

## Install Apache Ant ##

The latest version of Apache Ant is available from the [Apache Ant binary distribution page](http://ant.apache.org/bindownload.cgi). Download the ZIP file for the latest version, currently 1.7.1, and unpack it to anywhere on your machine. Then set the environment variable `ANT_HOME` to point to the unpacked folder and add `%ANT_HOME%\bin` to your `PATH`. (Note that if this addition is the last entry in the `PATH` variable, it will need to be followed by a semi-colon.)

There is an error in the `ant.bat` file which means that any errors that may occur are not signalled to the calling application. This in turn means that the Buildbot slave is always reporting 'success' to the Buildbot master.

So edit the Ant batch file, which will be in the `bin` directory set earlier, and go to line 202, which should have the following:
```
rem Set the ERRORLEVEL if we are running NT.
if "%OS%"=="Windows_NT" color 00

goto omega
```

Between the `if` statement and the `goto`, insert the following line:

```
exit /B %ANT_ERROR%
```

Open a new command prompt (an existing one won't have the new entries in the environment variables) and verify that you can run Ant:
```
ant -version
```
You should see version 1.7.1.

## Install HTMLTidy ##

Some of the build targets make use of the open-source [HTMLTidy](http://tidy.sourceforge.net/) application in order to clean up the results pages generated by Selenium. If you want your slave to build these targets successfully, you will need to [download HTMLTidy](http://tidy.sourceforge.net/#binaries) and unpack it to a folder on your system's `PATH`.

## Create the slave ##

Change directory to the Buildbot directory created above (`c:\Documents and Settings\buildbot`), and type the following command:
```
buildbot create-slave full uxf-bb.webbackplane.com:9989 wbp-vista-1 password
```
The server name and port number are fixed, because they represent the Ubiquity XForms master. The slave name and password (the last two parameters) will have been agreed at the beginning (see _Introduction_, above). The directory into which to install the slave files is set to `full` and is relative to the current directory.

Assuming all is well, a number of lines of output will be displayed, indicating that the files have been created correctly.

Once the slave information has been created, there will be a sub-directory called `info`, which will contain two files. The `admin` file holds details about who to contact for questions about the slave, and should be edited to contain the name and email address of the contact. The `host` file contains a description of the machine with an indication of the operating system and browsers that are installed. For example:
```
Microsoft Windows Vista, Service Pack 1
2 GHz dual core CPU
4 GB RAM
Microsoft Internet Explorer 7.0.6001.18000
Mozilla Firefox 3.0.7
Google Chrome 1.0.154.48
```
This is useful information that administrators can use when deciding which tests to allocate to which slaves.

## Launch the slave ##

To launch the slave, stay in the Buildbot directory (`c:\Documents and Settings\buildbot`) and type:
```
buildbot start full
```
or alternatively, change into the `full` directory (`c:\Documents and Settings\buildbot\full`), which is where the slave configuration files are located, and type:
```
buildbot start .
```
After a short wait the list of slaves on the master should include the freshly added slave:
```
http://uxf-bb.webbackplane.com:8080/buildslaves
```
If the slave has been added correctly then it should show up in the list with the comment _Slave is currently connected_. If the `admin` file information was added correctly then below this comment should be the name of the admin contact.

To check that the `host` file information was added correctly, click on the name of the builder that is using this slave, and detailed information about the builder should be displayed. Look for the slave in the list, and both the administration and host information should be displayed there.

For example, if the slave had been added to the builder `w3c-ts-ff` then its details should show up here:

```
http://uxf-bb.webbackplane.com:8080/builders/w3c-ts-ff
```

## Configure your browsers ##

Information about how to set up your browsers so that they can be used for testing is available at ConfiguringBrowsersForTests.