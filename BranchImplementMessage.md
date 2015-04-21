| SVN: | [implement-message](http://code.google.com/p/ubiquity-xforms/source/browse/branches/implement-message) |
|:-----|:-------------------------------------------------------------------------------------------------------|
| Owner: | [mdmcente](http://code.google.com/u/mdmcente/) |
| Discussion: | To discuss implementation details on this branch, use the [ubiquity-xforms-eng group](http://groups.google.com/group/ubiquity-xforms-eng/), and add `[BranchImplementMessage]` to your comments. |
| Features: | One of the features to consider is FeatureTooltip. (It is used when the message's level is ephemeral.) |

A "modal" xf:message is displaying pretty nicely in a dialog window.  Since it is "modal", you have to click on the OK button before you can do anything else on the page.

A "modeless" xf:message is displaying pretty nicely in a dialog window.  Since it is "modeless", you can still select on other buttons and type words on the page.

I made the xf:message's OK button visible with the code that I added in lib/xforms/actions.js. I also made the xf:message display correctly with the code that I added in default.css.  The xf:message and it's header look a lot better with these settings.

A "ephemeral" xf:message works pretty well, but it still needs work, because the message does not always appear where it should.

"modal" is the default level of a xf:message.

@ref & @value are supported.

xf:output elements inside a xf:message are supported, even though the message can contain the inline text when you only want the instance text (see [issue 46](https://code.google.com/p/ubiquity-xforms/issues/detail?id=46)).