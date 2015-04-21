Author: [Mark Birbeck](http://code.google.com/u/mark.birbeck@webBackplane.com/)

# Introduction #

A key goal of the [streamlined syntax proposal](StorySimplifiedSyntax.md) is that ordinary HTML elements should work smoothly with other XForms elements. This means that authors can begin with simple HTML forms, and gradually add more and XForms functionality as their need grows.

This work item is intended to establish a basis on which to build the simplification work, by providing support for one HTML control. Other work items will outline how other parts of the simplified syntax can be supported.

# Sequence #

## Allowing elements to be both a control and a value pseudo-element ##

The Ubiquity XForms architecture has been designed to allow as much flexibility as possible when it comes to substituting different parts of a control. This has meant that the place at which data is entered by the user is actually different to the control itself, and they have different areas of responsibility.

The data-entry area -- called the `value` pseudo-element -- is responsible for capturing user interaction and forwarding any results to any event listeners. There will usually only be one listener, and that is the form control.

From an MVC sense, the data-entry area is a _view_, whilst the form control acts as a _controller_; the _model_ is the data provided by the XForms model, and the form control registers for changes to the data that it is interested in.

The flexibility provided by having a `value` pseudo-element works very well for XForms controls, since they already contain labels, hints, alerts, help and so on; i.e., adding a sibling is no big deal.

However, for an HTML `input` this doesn't work, since the control has no child elements. In fact, it already plays the role of a data-entry element, or `value`. But it will also need to carry any `@ref` or `@bind` statements, which means that the HTML `input` will need to be _both_ the view _and_ the controller.

The first step would therefore be to decorate HTML `input` with the objects for _both_ XForms `input` and the XForms `input` `pe-value` element.

This can be achieved by adding extra CSS rules to `xforms-defs.js` as it stands now.

Note that the code for `Context` and `Control` generally uses pointers and event registration, for its operation. So the fact that `pe-value` is not a child of the form control should only be relevant at set-up time, when the events are registered, and from then on, it shouldn't matter.

Once that's working, then an HTML input control with a `@ref` or `@bind` should work just like an XForms control. If it doesn't, I would concentrate on getting it to work before moving on.

## Adding support for `@name` ##

The next step would then be to replace the `@ref` in the test form with `@name` (on the HTML `input` control).

For `@name` to work requires the automatic creation of a binding, if one doesn't exist.

As before, this should be done as part of the core code, rather than making some kind of special case out of HTML `input`. This could be done by having code for `@name` that is very similar to the code for `@bind`, with the only difference being that if no binding identified by the specified identifier exists, one would be created.

# Summary #

  1. Copy the loan form, and replace **one** XForms input element with an HTML input element. (I definitely wouldn't start with the entire simplified syntax form.)
  1. Ensure that the functionality for the `value` pseudo-element and the XForms `input` control _both_ get applied to the HTML `input` element.
  1. Verify that all existing XForms controls still work.
  1. Add another HTML `input` control, this time using `@name`.
  1. Add support for `@name` to `Context`.
  1. Verify that all existing bindings for other XForms controls, still work.

I'd suggest using the [new code review procedure](http://groups.google.com/group/ubiquity-xforms-eng/msg/4ab9999e281c3004?hl=en) I've outlined, to request a code review at step 3. Work can continue on steps 4, 5 and 6 whilst waiting for the first review to finish.