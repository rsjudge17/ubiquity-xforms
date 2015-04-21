# Introduction #
The [XForms Loan Application Form](http://ubiquity-xforms.googlecode.com/svn/branches/loan-form/_samples/Loan/loan-lowercase.html) demonstrates various XForms features. In order to further refine the notation and explore an approach to implementing the [stream-lined syntax in Ubiquity XForms ](StorySimplifiedSyntax.md). We converted the loan form example to stream-lined syntax based on the [XForms 1.2 Stream-Lined Syntax Proposal](http://lists.w3.org/Archives/Public/public-forms/2008Mar/0097.html) and additional syntax in the tentative syntax section.

  * **stream-lined syntax formerly known as simplified syntax**

# Stream-lined Loan Form #

The following form shown the stream-lined syntax of the [XForms Loan Application Form](http://ubiquity-xforms.googlecode.com/svn/branches/loan-form/_samples/Loan/loan-lowercase.html).

```

<?xml version="1.0"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
   <script src="../../ubiquity-simple.js" ></script>
   <script src="../../ubiquity-loader.js" type="text/javascript">/**/</script>
</head>
<body>

<form name="datarecord" impl="xforms-simple" method="post"
      action="http://xformstest.org/cgi-bin/echo.sh"  >
   <label>Loan Form</label>
   <label for="startdate" >Agreement Date:</label>
   <input name="startdate" type="date" default="08-08-2008" />
   <br/>
   <group name="borrower">
     <label>Borrower</label>
     <label for="name">Name:</label>
     <input id="name" name="name" type="string" default="Joe Q. Public" 
            constraint="string-length(.) > 0" />
     <br/>
     <label for="addr">Address:</label>
     <input id="addr" name="addr" type="string" default="123 Main St. Tinyville" 
            constraint="string-length(.) > 0" />
     <br/>     
   </group>
   <label for="">Principal</label>
   <input name="principal" type="double" default="10000" 
          constraint=". &gt;= 1000 and . &lt;= 100000" />
   <br/>
   <label for="currency">Choose currency</label>
   <select name="currency" >
     <option value="USD">US Dollars</option>
     <option value="CDN">Canadian Dollars</option>
     <option value="EUR">Euros</option>
   </select>
   <br/>
   <label for="duration">Duration of Loan in Months:</label>
   <input name="duration" type="integer" default="12" 
          constraint=". &gt; 0 and . &lt;= 84" />
   <label for="interestrate">Yearly Interest Rate:</label>
   <input name="interestrate" type="double" default="5" 
          constraint=". &gt;= 5 and . &lt;= 60" />
   <br/>
   <label for="submit">Apply Loan</label>
   <submit id="submit" />
</form>
<hidden name="rate" calculate="interestrate div 1200.0" />
<output name="monthly-payment" 
        calculate="if(rate &gt; 0, principal * rate div (1.0 - power(1.0 + rate, -duration)), principal div duration" 
        relevant="principal &gt; 0 and duration &gt; 0" />
<output name="totalpayout" calculate="monthly-Payment * duration" 
        relevant="monthly-payment &gt; 0 and duration &gt; 0" />
</body>
</html>

```

# Tentative Syntax #

In order to complete the conversion to the stream-lined syntax. Assumptions are made and tentative syntaxes are introduced in addition to the  [Summarized XForms Stream-Lined Syntax Proposal](http://lists.w3.org/Archives/Public/public-forms/2008Mar/0097.html). Here is the summary:


#### 1) Namespace ####
> The elements of the stream-lined syntax is assumed to be in the HTML namespace tentatively.

#### 2) Impl Attribute ####
> Since the form is assumed to be in an HTML namespace, there should be a way to separate/switch the stream-lined syntax from a regular HTML's form. Since namespace seems to be a non-starter. An _impl_ attribute is tentatively added to indicate the content of the form is implemented using xforms's stream-lined syntax.
```
<form impl="xforms-simple"... >
..
</form>
```

#### 3) Group Element ####
> In the original loan form example, the data instance has a structure that doesn't involve a repeat (such as the one in the summarized example). A _group_ element is added to capture the same data structure of a structured data instance.
```
   <!-- sturcture data instance using stream-lined syntax -->
   <group name="borrower">
     <input id="name" name="name" type="string" default="Joe Q. Public" />
     ...
     <input id="addr" name="addr" type="string" default="123 Main St. Tinyville" />
     ...
   </group>

   <!-- data structure in data instance -->
   <borrower>
     <name>John Q. Public</name>
     <addr>123 Main St. Tinyville</addr>
   </borrower>   
```

#### 4) Label Syntax ####
> In the Stream-Lined Syntax Proposal, there is no dicussion of where to obtain or how to specific the xforms's label in the syntax. Most of the time in HTML, label is just a brunch of text nodes in front of the HTML input field.
> In above loan form example, the HTML label/for syntax is used as to define an input's label. A _label_ element is specified with inline text and a _for_ attribute is referenced to input element's id; Also notice a label element can be hanged as a child element of a container (form/group) which indicate that the label is for the corresponding group/form.
```
  <group name="borrower">
    <label>Borrower</label>
    <label for="name">Name:</label>
    <input id="name" name="name" type="string" default="Joe Q. Public" />
    ....
  </group>
```
> The syntax is a tentative decision to cater more to the existing HTML syntax. I would imagine others might has different opinion on that. Some has suggested we could simpify it by adding a _label_ attribute on the input or putting the label as inline text of an input.
```
    <!-- inline text -->
    <input id="name" name="name" type="string" default="Joe Q. Public">Name: </input>
    <!-- label attribute -->
    <input id="name" label="Name :" name="name" type="string" default="Joe Q. Public" />
```

# Comment #

JB: A few issues need to be fixed:
  * ~~The default date should be conformant to xsd:date~~
  * ~~The monthly payment and total payout calculations are all wrong. Where are the ones that use the power function?~~
  * ~~The monthly payment and total payout need relevant calculations~~
  * ~~The interestrate needs to be a hidden input, not an output~~
  * Please apply the better looking stylings of the new loan form
TL: Cross out items are fixed