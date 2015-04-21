| SVN: | [implement-getLocalName](http://code.google.com/p/ubiquity-xforms/source/browse/branches/implement-getLocalName) |
|:-----|:-----------------------------------------------------------------------------------------------------------------|
| Owner: | [paul.butcher](http://code.google.com/u/paul.butcher/) |
| Discussion: | To discuss implementation details on this branch, use the [ubiquity-xforms-eng group](http://groups.google.com/group/ubiquity-xforms-eng/), and add `[BranchImplementGetLocalName]` to your comments. |
| Features: | FeatureConsistentLocalName and FeatureCompareFullName |

This branch was instigated as there are a number of locations in which a local name (i.e. a non-namespace qualified name) is retrieved from the name given by the browser, by removing any reported colon, and preceding characters.  I have also seen places in which this is needed, but not done, and so may lead to buggy behaviour, and also an inconsistent use of tagName vs nodeName vs localName (the latter of which, in Firefox, returns the whole name, with prefix)

(Internet Explorer nodes do not have a localName variable to use.)

By replacing instances of this "name truncation", with an appropriately named function, code readability and maintainability is improved.

It is also desirable to be able to test a node against a QName, for mixed-namespace situations in which an ambiguity may occur.