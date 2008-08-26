/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

UX.calendarcount = 0;

function InputValueCalendar    (elmnt)
{
    this.element = elmnt;
    this.currValue = "";
    this.m_bFirstSetValue = true;
    this.m_bPopup = false;
    this.m_sInputId = '';
}


function calendarValueChanged(pThis, sNewValue)
{
    var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
    if(oEvt.initMutationEvent === undefined) {
        oEvt.initMutationEvent = oEvt.initEvent;
    }
        
    oEvt.initMutationEvent("control-value-changed", true, true,
        null, pThis.currValue, sNewValue, null, null);

    if (pThis.m_bPopup) {
        YAHOO.util.Dom.get(pThis.m_sInputId).value = sNewValue;
    }
    spawn(function() {
            FormsProcessor.dispatchEvent(pThis.element, oEvt);
    });
}

InputValueCalendar.prototype.currentCalendarValue = function()
{
    var date = this.m_value.getSelectedDates()[0];
    var yr = date.getYear();
    yr = (yr > 1900) ? yr : (1900 + yr); // TODO, Calendar may return year modulo 1900 to begin with
    var mn = date.getMonth() + 1;
    var da = date.getDate();
    currValue = (mn < 10 ? '0' + mn : mn) + '/' + (da < 10 ? '0' + da : da) + '/' + yr;
    return currValue;
}

InputValueCalendar.prototype.onDocumentReady = function()
{
    if (this.element.ownerDocument.media != "print")
    {
        var pThis = this,
            appearance = this.element.parentNode.getAttribute("appearance"),
            datatype = this.element.parentNode.getAttribute("datatype");

        if (appearance === 'yui:popup-calendar' ||
            ((datatype === 'xsd:date' || datatype === 'xf:date' || datatype === 'xforms:date') && appearance === 'compact')) { // popup

            this.m_bPopup = true;
            this.m_sInputId = "ux-calendar-input-" + UX.calendarcount;
            this.element.innerHTML = "<div id='ux-calendar-bg" + UX.calendarcount + "' class='ux-calendar-bg'>" +
                "<input type='text' disabled='true' class='ux-input-compact-calendar' id='" +
                this.m_sInputId + "'></input></div>";

            var calendarMenu = new YAHOO.widget.Overlay("calendarmenu" + UX.calendarcount,
                                                        { visible: false });
            var button = new YAHOO.widget.Button({type: "menu",
                                                  id: "calendarpicker" + UX.calendarcount, 
                                                  label: "", 
                                                  menu: calendarMenu,
                                                  container: "ux-calendar-bg" + UX.calendarcount});
            var calcount = UX.calendarcount;

            button.on("appendTo", function () {
                calendarMenu.setBody("&#32;"); // body is needed, add a space
                calendarMenu.body.id = "calendarcontainer" + calcount;
                calendarMenu.render(this.get("container"));
            });

            button.on("click", function () {
                if (pThis.m_value == null) {

                    pThis.m_value = new YAHOO.widget.Calendar("ux-calendar-" + calcount, calendarMenu.body.id);
                    if (pThis.currValue != null) { // set initial date, if one is bound
                        pThis.m_value.setYear(pThis.currValue.substring(6,10));
                        pThis.m_value.setMonth(pThis.currValue.substring(0,2) - 1);
                        pThis.m_value.select(pThis.currValue);
                    }
                    pThis.m_value.render();

                    pThis.m_value.changePageEvent.subscribe(function () {
                        window.setTimeout(function () {
                            calendarMenu.show();
                        }, 0);
                    });

                    pThis.m_value.selectEvent.subscribe(function() {
                        calendarValueChanged(pThis, pThis.currentCalendarValue());
                        calendarMenu.hide();
                        pThis.m_value.hide(); // Required to avoid bleeding in IE
                    });
                }

                pThis.m_value.show();
                calendarMenu.show();
            });

        } else { // inline

            this.element.innerHTML = "<div id='ux-calendar-bg" + UX.calendarcount + "' class='ux-calendar-bg'></div>";
            this.m_value = new YAHOO.widget.Calendar("ux-calendar-" + UX.calendarcount, "ux-calendar-bg" + UX.calendarcount);

            this.m_value.selectEvent.subscribe(
                function() {
                    calendarValueChanged(pThis, pThis.currentCalendarValue());
                }
             );

            this.m_value.render();
        }

        UX.calendarcount++;
    }
};

InputValueCalendar.prototype.setValue = function(sValue)
{
    var bRet = false;

    if (sValue.match( /^(\d{2})\/(\d{2})\/(\d{4})/ )) {

        if (this.currValue != sValue || m_bFirstSetValue) {
            this.currValue = sValue;
            if (this.m_bPopup) {
                YAHOO.util.Dom.get(this.m_sInputId).value = sValue;
            }
            if (this.m_value != null) { // avoid race when popup
                this.m_value.setYear(RegExp.$3);
                this.m_value.setMonth(RegExp.$1 - 1);
                this.m_value.select(sValue);
                this.m_value.render();
            }
            bRet = true;
            if (this.m_bFirstSetValue) {
                this.m_bFirstSetValue = false;
            }
        }
    
    }

    return bRet;

};

