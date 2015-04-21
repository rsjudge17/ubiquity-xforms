# Introduction #

This page describes the UXF architecture.



# Overview #

The core philosophy of Ubiquity XForms (and indeed of the entire Ubiquity library) is that developers should be able to hide their preferred Ajax library behind declarative mark-up.

This means that the bulk of the library consists of a layer which provides support for a range of XForms and backplane features, that sits on top of some _other_ Ajax library, such as YUI, jQuery, Dojo, and so on. Alongside this collection of modules sits a binding module that processes authors' mark-up, and uses it to determine which functionality to add. The mark-up can therefore effectively be seen as a set of 'hooks' that are used by the core JavaScript code to determine its course of action.

Although the author is free to use JavaScript directly, alongside the script that handles the core XForms mark-up, greater code portability can achieved by using as much mark-up as possible. For this reason UXF provides a number of extension points to allow additional JavaScript code that an author might add, to still be used via the mark-up.

## Mixins ##

A key part of the design is that multiple objects -- called _mixins_ -- can be added to an element in the document, independently of each other. This makes the architecture both easier to manage and incredibly flexible; rather than having to organise the modules in a hierarchical inheritance-based model, we have what amounts to a 'flat' model, where any mixin can be added to any element. (See [Mixins](Mixins.md) for a full list of mixins.)

### Communicating Between Mixins ###

Communication between mixins generally takes place via events, even if two mixins are attached to the same element. All of the Ubiquity libraries use [DOM 2 Events](http://www.w3.org/TR/DOM-Level-2-Events/) as their preferred event standard. Although `DOM 2 Events` is supported natively by most browsers, UXF automatically invokes a JavaScript implementation when running on Internet Explorer.

# Document Loading #

The first step to running an XForms document with UXF involves loading the document and giving control to the UXF processor.

## Loading the XForms document ##

The first thing that the browser does is to load an XForms document. Since the browser does not natively understand XForms elements, then the XForms mark-up in the document will be ignored. Modern browsers are, however, able to format this mark-up, even if they don't understand it, and so the elements will be preserved and displayed in the document much like a collection of `div`s and `span`s.

## Handing control to UXF ##

To use UXF an author needs to place a `script` tag in the `head` element, with a reference to the UXF loader. The most up-to-date details are at UsingTheLibrary, but as an illustration, the tag would look something like this:

```
<script src="http://ubiquity-xforms.googlecode.com/svn/tags/0.6.2/ubiquity-loader.js" type="text/javascript">/**/</script>
```

# The Binding Sequence #

Once UXF has control, its first task is to attach XForms functionality to the various XForms elements in the document, via the mixins. Once the functionality has been attached, the XForms processor 'proper' takes over.

## Decorating Elements with Mixins ##

UXF contains a set of rules to determine the functionality that should be added to the various XForms elements in the document; we call the process of adding functionality _decoration_. Elements may have different functionality attached, depending on where they appear in the document.

For Firefox and Internet Explorer browsers the built-in CSS architecture is used to attach functionality. However, WebKit-based browsers do not currently support this CSS mechanism, so in this situation UXF will automatically fall back to a more processor-intensive technique. However, regardless of the approach used to carry out the binding, the rules used are the same, and the mixins added are also the same. How to control which elements and are discussed in AddingElementsForDecoration.

## Initialising Mixins ##

Most mixins can be initialised within their constructors, in the same way that any other JavaScript objects can. However, during the binding process, each element will also receive both an `OnContentReady` event, and an `OnDocumentReady` event. During decoration, mixins are free to register for one or both of these events, and to use them to carry out further initialisation.

For example, a mixin that adds functionality for controls might need to add further elements as children of the element that it is attached to. It should only do this once the element has fully loaded, and so for this reason would register for the `OnContentReady` event, and then add the child elements in the event handler. The same mixin also needs to attach itself to the correct XForms model, but there is no point in trying to do this until all models are loaded, so the mixin would register for the `OnDocumentReady` event, and then search for the correct model in the event handler.

Since communication between mixins takes place via events, then much of the initialisation sequence will involve registering for the appropriate events on elements. Note that we don't register for events directly on mixins, since the architecture is so _loosely-coupled_ that we don't actually know what mixins are attached to a particular element. However, that isn't important, because the key interface to the element is the events it fires, and understands; by registering for a particular event on an element, we are effectively saying 'if some mixin fires this event -- and we don't care which it is -- we want to know about it'.

# Processor Loading Details #

The XForms processor side of UXF loads incrementally as the mixins are gradually added to the elements in the document. This will be documented in more detail shortly.