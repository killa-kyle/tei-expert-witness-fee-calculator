jQuery(document).ready(function($){function e(){l(),o()}function t(e){var t=$.extend({},c,e);console.log("State updated:",t),c=t}function n(e){console.log("rendering....."),$("#results").html(""),$("#results").append("<h3>Looking for  "+c.SPECIALTY+" Expert Witness Fees in "+c.STATE+"</h3>")}function o(){$("#state-input").change(function(e){var n=$(this).find("option:selected").val();t({STATE:n}),i()})}function a(e){var t=_.where(e,{State:"US"}),n=[];return $.each(t,function(e,t){n.push({value:t["Summarized Specialty Area"]})}),n}function r(e){console.log("autocomplete",e),$("#specialty-input").autocomplete({lookup:e,onSelect:function(e){console.log("You selected: "+e.value),t({SPECIALTY:e.value}),i()}})}function l(){var e=$("#nonce").attr("data-nonce"),t=$.ajax({url:feeAjax.ajaxurl,type:"GET",dataType:"text",data:{action:feeAjax.action,nonce:e}});t.then(function(e){console.log("FOUND FEE DATA",e)})}function i(){console.log("submitting....");var e=_.where(JSON.parse(u),{State:c.STATE,"Summarized Specialty Area":c.SPECIALTY}),t=_.where(JSON.parse(u),{State:"US","Summarized Specialty Area":c.SPECIALTY});console.log("found :",e[0]),e.length?($("#result-chart-review-fee").html(e[0]["Fee Chart Review"]),$("#result-court-fee").html(e[0]["Fee Court"]),$("#result-deposition-fee").html(e[0]["Fee Deposition"]),$("#fee-result-header").html(c.SPECIALTY+" Expert Witness Average Fees for "+c.STATE)):t.length?($("#result-chart-review-fee").html(t[0]["Fee Chart Review"]),$("#result-court-fee").html(t[0]["Fee Court"]),$("#result-deposition-fee").html(t[0]["Fee Deposition"]),$("#fee-result-header").html("National Avg. Fees for  "+c.SPECIALTY+" Expert Witnesses")):$("#fee-result-header").html("Sorry, We couldn't find any fee information for \""+c.SPECIALTY+'"')}var u=[],c={SPECIALTY:"",STATE:"AL"};e(),$("#expert-fee-calulator-form").on("submit",function(e){e.preventDefault(),t({SPECIALTY:$("#specialty-input").val().trim()}),i(e)})});