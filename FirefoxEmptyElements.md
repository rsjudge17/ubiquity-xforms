# Introduction #

All browsers take lengths to interpret markup that they don't properly understand, the mechanism by which Firefox interprets short-form empty elements in HTML mode is a hindrance to Ubiquity.

# Details #

In Firefox, unless an element is declared as EMPTY in the current DTD, the single-tag empty element format is treated as an opening tag.  So, although "<br />" and "<br></br>" are synonymous in an HTML document, 

&lt;xf:label ref="x" /&gt;

 is interpreted as 

&lt;xf:label ref="x"&gt;

, and Firefox then cleverly adds the closing tag somewhere unhelpful.
Unfortunately, there doesn't appear to be a reasonable way to divine whether the browser is lying about the structure of the markup.

This also affects inline instance data,
```
<data xmlns="">
	<quirkafleeg />
	<firstname>John</firstname>
	<surname>Doe</surname>
</data>
```

Is interpreted by Firefox as:

```
<data xmlns="">
	<quirkafleeg>
		<firstname>John</firstname>
		<surname>Doe</surname>
	</quirkafleeg>
</data>
```

Note that elements defined this way are not necessarily bounded by an existing ancestor closing tag.

The following model:

```
<xf:model>
	<xf:submission action="/cgi-bin/subscribe.cgi" method="post" ref="info" id="subscribe"></xf:submission>
	<xf:instance id="i0">
			<x:subscription xmlns="" xmlns:x="someURN">
				<info>
					<age/>
					<email/>
					<addresss >
						<pobox/>
						<street/>
						<city/>
						<state/>
						<zip/>
					</addresss>
					<name>
						<first> </first>
						<last> </last>
					</name>
				</info>
			</x:subscription>
	</xf:instance>
	
	<xf:bind nodeset="info/addresss" relevant="/subscription/info/age >= 3"></xf:bind>
	<xf:bind nodeset="info/name" relevant="/subscription/info/age >= 13"> </xf:bind>
	<xf:bind nodeset="info/email" required="true()"></xf:bind>
	<xf:bind nodeset="info/age" required="true()" type="xsd:integer"></xf:bind>
	
</xf:model>

```

Is reported by Firefox, to  have this structure, instead.

```
<xf:model _moz-userdefined="">
	<xf:submission id="subscribe" _moz-userdefined="" ref="info" method="post" action="/cgi-bin/subscribe.cgi"/>
	<xf:instance id="i0" _moz-userdefined="">
		<x:subscription _moz-userdefined="" xmlns:x="someURN" xmlns="">
			<info _moz-userdefined="">
				<age _moz-userdefined="">
					<email _moz-userdefined="">
						<addresss _moz-userdefined="">
							<pobox _moz-userdefined="">
								<street _moz-userdefined="">
									<city _moz-userdefined="">
										<state _moz-userdefined="">
											<zip _moz-userdefined=""/>
											<name _moz-userdefined="">
												<first _moz-userdefined=""/>
												<last _moz-userdefined=""/>
											</name>
										</state>
									</city>
								</street>
								<xf:bind _moz-userdefined="" relevant="/subscription/info/age >= 13" nodeset="info/addresss"/>
								<xf:bind _moz-userdefined="" relevant="/subscription/info/age >= 13" nodeset="info/name"/>
								<xf:bind _moz-userdefined="" required="true()" nodeset="info/email"/>
								<xf:bind _moz-userdefined="" type="xsd:integer" required="true()" nodeset="info/age"/>
							</pobox>
						</addresss>
					</email>
				</age>
			</info>
		</x:subscription>
	</xf:instance>
</xf:model>

```


This occurs in both quirks mode and standards mode (both defined within the document).  Firefox, when running in XHTML mode, which is invoked by mime-type, does not mangle the markup.  Unfortunately, IE does not treat XHTML documents in the same way as HTML documents, and, by default, renders it using its prettyprint XML view.  This means that in order to work equally in both browsers, the same content must be delivered with different mime-types, which requires User-Agent resolution on the server, which is undesirable in this project.