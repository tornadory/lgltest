jQuery.noConflict(),jQuery(document).ready(function(e){function t(e){var t=document,l=t.getElementById(e);if(t.body.createTextRange){var c=t.body.createTextRange();c.moveToElementText(l),c.select()}else if(window.getSelection){var a=window.getSelection(),c=t.createRange();c.selectNodeContents(l),a.removeAllRanges(),a.addRange(c)}}if(e("#enabler").click(function(){"disabled"==e("#gmt1").attr("disabled")?e("#gmt1").prop("disabled",!1):e("#gmt1").prop("disabled",!0)}),navigator.userAgent.match(/IEMobile\/10\.0/)){var l=document.createElement("style");l.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}")),document.getElementsByTagName("head")[0].appendChild(l)}e(function(){e("#baseLeftResult").click(function(){t("baseLeftResult")})});var c=e(".baseLeftResult");e(".preEnabler").click(function(){c.parent().is("pre")?c.unwrap():c.wrap("<pre></pre>")}),e(".show_array").click(function(){e(".show_data").toggle()}),e(".clear_text").click(function(){e("#text_area").val("")}),e("#selectable").click(function(){t("selectable")}),e("#selectable_html").click(function(){t("selectable_html")}),e("#selectable_xml").click(function(){t("selectable_xml")}),e("#selectable_b64").click(function(){t("selectable_b64")}),e("#selectable_browser").click(function(){t("selectable_browser")})});