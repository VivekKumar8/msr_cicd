//  Copyright (c) 2013-2019 Software AG, Darmstadt, Germany and/or Software AG USA Inc., Reston, VA, USA, and/or its subsidiaries and/or its affiliates and/or their licensors.

var requiredFields = new Array();
var validationFields = new Array();
var passmanFieldsMap = new Array();
var packageName = "";

var CMGRPROP = { 
  minimumPoolSize : "1", 
  maximumPoolSize :"100", 
  poolIncrementSize : "1", 
  blockTimeout : "1000", 
  expireTimeout : "1000", 
  startupRetryCount : "0", 
  startupBackoffSecs : "10",
  timeoutType : "none",
  sessionExpiry : "15"
  };

function populateRequiredFields(fieldName)
{
  requiredFields.push(fieldName);
}

function populateValidationFields(fieldName)
{
  validationFields.push(fieldName);
}

function setPackageName(pkgName) {
	packageName = pkgName;
}

function populatePassmanFields(fieldName, fieldValue) {
	passmanFieldsMap.push({
		'name'		 : fieldName,
		'value'		 : fieldValue
	});
}

function isNumber(num)
{
    num = num.toString();
    if (num.length == 0) {
        return false;
    }

    for (var i = 0; i < num.length; i++) {
        var x = num.substring(i, i + 1);
        // LG TRAX 1-NWQZN - Fix to allow negative numbers
        // to be validated....Before all neg numbers errored
        if (i == 0 && x == "-") {
            if(num.length == 1) {
                return false;
            }
        }
        else if (x < "0" || x > "9") {
            return false;
        }
    }

    return true;
}


var pwdLabels = new Array(" "," "," "," "," "," "," "," "," "," "," "," "," "," ");
function passwordChanged(theForm, pwdElem) {
    for(i = 0;i < pwdLabels.length;i++){
	if(pwdLabels[i] == pwdElem){
		break;
	}
	else if(pwdLabels[i] == " "){
		pwdLabels[i] = pwdElem;
		break;
	}
    }
    if(i == pwdLabels.length){
	alert(getmsg("many.password.fields"));
        return false;
    }
    theForm.elements['passwordChange'].value = pwdLabels;
}


function validateForm(theForm)
{
    var returnValue = 0;
    var errors = getmsg("errors") + "\n";
	
	var missingRequiredFieldsError = getmsg("missing.required.field");
	var invalidFieldsError = getmsg("invalid.input.field");
	var otherErrors = "";
	
	var missingRequiredFields = new Array();
	var invalidFields = new Array();

    if (theForm.elements['connectionFolderName'] != null && theForm.elements['connectionFolderName'].value.length == 0) {
		returnValue = -1;
        missingRequiredFields.push(getmsg("folder.name"));
    
	} else if (theForm.elements['connectionFolderName'] != null 
			&& !(/^[a-z_]+[\w\.]*[\w]$/i.test(theForm.elements['connectionFolderName'].value))) {
		returnValue = -1;
		invalidFields.push(getmsg("folder.name"));
	}
	
    if (theForm.elements['connectionName'] != null && theForm.elements['connectionName'].value.length == 0) {
        returnValue = -1;
        missingRequiredFields.push(getmsg("connection.name"));
    
	} else if (theForm.elements['connectionName'] != null 
			&& !(/^[a-z_]+[\w]*$/i.test(theForm.elements['connectionName'].value))) {
		returnValue = -1;
		invalidFields.push(getmsg("connection.name"));
	}

    //var str = "";
	for (i = 0; i < theForm.elements.length; ++i) {
        // password confirmation fields start with "PWD"
        if (theForm.elements[i].name.substring(0, 3) == "PWD") {
            var sname = theForm.elements[i].name.substring(4);
            var dotpos = sname.indexOf('.', 0);
			
            //str += "dotpos = " + dotpos + "\n";
            //str += "theForm.elements[" + sname + "].value = " + theForm.elements[sname].value + "\n";
            //str += "theForm.elements[" + i + "].value = " + theForm.elements[i].value + "\n";
			
            if (theForm.elements[i].value.length == 0 && theForm.elements[sname].value.length > 0) {
                returnValue = -1;
                otherErrors += getmsg("retype.password", sname.substring(dotpos + 1)) + "\n";
            }
            else if (theForm.elements[sname].value.length != theForm.elements[i].value.length) {
			   
                returnValue = -1;
                otherErrors += getmsg("pwd.mismtach", sname.substring(dotpos + 1)) + "\n";
            }
			else if (theForm.elements[sname].value != theForm.elements[i].value) {
			   
                returnValue = -1;
                otherErrors += getmsg("pwd.mismtach", sname.substring(dotpos + 1)) + "\n";
            }
        }
    }
	
	
	//Check for Required Fields Content Length to ensure its not left Blank
	for(i = 0; i < requiredFields.length; i++) {
	  
	  if(!theForm.elements[requiredFields[i]].value.match(/\S/)){
	    
		var displayName = theForm.elements[requiredFields[i]].parentNode.parentNode.getElementsByTagName("td")[0].textContent;
	    returnValue = -1;
        displayName = (displayName.indexOf('*')==(displayName.length-1)? displayName.substring(0, displayName.length - 1): displayName);
	    missingRequiredFields.push(displayName);
	  }  
	}
	
	
	// Data Type validation for Integer Fields 
	for(i = 0; i < validationFields.length; i++) {
		if(theForm.elements[validationFields[i]].value.length > 0) {
			
			if(isNaN(theForm.elements[validationFields[i]].value)){
				var displayName = theForm.elements[validationFields[i]].parentNode.parentNode.getElementsByTagName("td")[0].textContent;
				var index = displayName.indexOf("*");
				if(index != -1 && index == 0) {
					displayName = displayName.substring(1);
				}
				returnValue = -1;
				invalidFields.push(displayName);
			}
			
				}
			}

	if(theForm.elements['listenerAlias'] != null) {
		returnValue = handleListenerErrorConfig(missingRequiredFields, invalidFields, theForm, returnValue);
	}
	// build alert error message
    if(missingRequiredFields.length > 0) {
		errors +=  missingRequiredFieldsError + missingRequiredFields.join(", ") + ".\n";
	}
	if(invalidFields.length > 0) {
		errors +=   invalidFieldsError + invalidFields.join(", ") + ".\n";
    }
	errors += otherErrors;

    if (returnValue == -1) {
        alert(errors);
        return false;
    }
    else {
        return true;
    }
}

function setField(field, val)
{
    if (val) {
        field.disabled = false;
    }
    else {
        field.value = "";
        field.disabled = true;
        //field.setAttribute("color", "red");
    }
}

function handleListenerErrorConfig(missingRequiredFields, invalidFields, theForm, returnValue) {
	
	if(! (theForm.elements["CPROP$errorHandler$Basic$eh.callbackServiceName"] == null 
					|| theForm.elements["CPROP$errorHandler$Basic$eh.callbackServiceName"].value.length >= 0)) {
		
		var displayName = theForm.elements["CPROP$errorHandler$Basic$eh.callbackServiceName"].parentNode
							.parentNode.getElementsByTagName("td")[0].textContent;			
		displayName = (displayName.indexOf('*')==(displayName.length-1)? displayName.substring(0, displayName.length - 1): displayName);
			
		var isValidServiceName = validateCallbackService();
		if(!isValidServiceName) {
			invalidFields.push(displayName);
			returnValue = -1;
		}
	}
	
	return returnValue;
}

function setEnabledFields(theForm, val)
{
    setField(theForm.elements["CMGRPROP$minimumPoolSize"],   val);
    setField(theForm.elements["CMGRPROP$maximumPoolSize"],   val);
    setField(theForm.elements["CMGRPROP$poolIncrementSize"], val);
    setField(theForm.elements["CMGRPROP$blockTimeout"],   val);
    setField(theForm.elements["CMGRPROP$expireTimeout"],     val);
    setField(theForm.elements["CMGRPROP$startupRetryCount"],   val);
    setField(theForm.elements["CMGRPROP$startupBackoffSecs"],     val);
}

function handlePoolableChange(theForm)
{
    var poolableobj = theForm.elements["CMGRPROP$poolable"];
    var poolable = poolableobj.options[poolableobj.selectedIndex].value;

    if (poolable == "true") {
        theForm.elements["CMGRPROP$minimumPoolSize"].value = CMGRPROP.minimumPoolSize;
        theForm.elements["CMGRPROP$maximumPoolSize"].value = CMGRPROP.maximumPoolSize;
        theForm.elements["CMGRPROP$poolIncrementSize"].value = CMGRPROP.poolIncrementSize;
        theForm.elements["CMGRPROP$blockTimeout"].value = CMGRPROP.blockTimeout;
        theForm.elements["CMGRPROP$expireTimeout"].value = CMGRPROP.expireTimeout;
        theForm.elements["CMGRPROP$startupRetryCount"].value = CMGRPROP.startupRetryCount;
        theForm.elements["CMGRPROP$startupBackoffSecs"].value = CMGRPROP.startupBackoffSecs;

        setEnabledFields(theForm, true);
    }
    else if (poolable == "false") {
        CMGRPROP.minimumPoolSize = theForm.elements["CMGRPROP$minimumPoolSize"].value;
        CMGRPROP.maximumPoolSize = theForm.elements["CMGRPROP$maximumPoolSize"].value;
        CMGRPROP.poolIncrementSize = theForm.elements["CMGRPROP$poolIncrementSize"].value;
        CMGRPROP.blockTimeout = theForm.elements["CMGRPROP$blockTimeout"].value;
        CMGRPROP.expireTimeout = theForm.elements["CMGRPROP$expireTimeout"].value;
        CMGRPROP.startupRetryCount = theForm.elements["CMGRPROP$startupRetryCount"].value;
        CMGRPROP.startupBackoffSecs = theForm.elements["CMGRPROP$startupBackoffSecs"].value;

        setEnabledFields(theForm, false);
    }
}

function handleSessionManagementChange(theForm)
{
    var timeoutTypeObj = theForm.elements["CMGRPROP$timeoutType"];
    var timeoutType = timeoutTypeObj.options[timeoutTypeObj.selectedIndex].value;

    if (timeoutType == "none") {
        CMGRPROP.sessionExpiry = theForm.elements["CMGRPROP$sessionExpiry"].value;
        setField(theForm.elements["CMGRPROP$sessionExpiry"], false);
    }
    else {
        theForm.elements["CMGRPROP$sessionExpiry"].value = CMGRPROP.sessionExpiry; 
        setField(theForm.elements["CMGRPROP$sessionExpiry"], true);
    }
}

function handleConnectionTypeChange(theForm)
{   
    var url = location.search;
    var connTypeDD = document.getElementById("connectionTypeDD");
    
    var updatedUrl = replaceParametersForAuth("connectionType", url, connTypeDD.options[connTypeDD.selectedIndex].value);
    updatedUrl = replaceParametersForAuth("authenticationType", updatedUrl, connTypeDD.options[connTypeDD.selectedIndex].text);
    
    location.search = updatedUrl;
    location.replace();
}

function replaceParametersForAuth(paramName, url, paramValue){
    var authIndex = url.indexOf("&"+paramName);
    var updatedUrl = "";
    if(authIndex!=-1){
        var params = url.split("&");
        for(i=0; i<params.length; i++){
            var param = params[i].split("=");
            if(param[0]==paramName){
                params[i] = paramName+"="+paramValue;
            }
            updatedUrl = updatedUrl +"&"+ params[i];
        }
        updatedUrl = updatedUrl.substring(1, updatedUrl.length);
    } else{
        updatedUrl = url + "&"+paramName+"="+paramValue;
    }
    
    return updatedUrl;
}

function onConnectionPageLoad(theForm)
{		
    if (theForm.elements["CMGRPROP$poolable"]!=undefined && theForm.elements["CMGRPROP$poolable"].value == "false") {
		setEnabledFields(theForm, false);
	}
	if (theForm.elements["CMGRPROP$timeoutType"]!=undefined && theForm.elements["CMGRPROP$timeoutType"].value == "none"||theForm.elements["CMGRPROP$timeoutType"].value == "auto") {
		setField(theForm.elements["CMGRPROP$sessionExpiry"], false);
	}
    
    var connTypeDD = document.getElementById("connectionTypeDD");
	if(connTypeDD!=null)
	{
		var values = connTypeDD.options;
		for(i=0; i<values.length; i++){
			if((values[i].value)==(document.getElementById('connectionType').value)){
				connTypeDD.selectedIndex = i;
			}
		}
		document.getElementById('connectionType').value = connTypeDD.options[connTypeDD.selectedIndex].value;
		document.getElementById('authenticationType').value = connTypeDD.options[connTypeDD.selectedIndex].text;
	}
    
    handleRefreshTokenChange(theForm);
    
}

function handleRefreshTokenChange(theForm){
    
	var refreshAccessTokenClass = theForm.getElementsByClassName("refreshAccessToken");
	var refreshAccessToken = refreshAccessTokenClass[0];
	
	if(refreshAccessToken != undefined){
		var tokenField = refreshAccessToken.name;
		var isRefreshAccessToken = refreshAccessToken.options[refreshAccessToken.selectedIndex].value;
		var refreshTokenField = getTokenField(tokenField);
		var indexR = requiredFields.indexOf(refreshTokenField);
		if (isRefreshAccessToken=="true") {
			if(indexR==-1){
				requiredFields.push(refreshTokenField);
			}
		} else if(isRefreshAccessToken=="false"){
			if(indexR!=-1){
				requiredFields.splice(indexR, 1);
			}
		}
	}
}

function getTokenField(tokenField){
	var tokenPrefix = tokenField.substring(0,tokenField.lastIndexOf("."));
	return tokenPrefix+".refreshToken";
}

	/**
	 Below functions are related to dynamic look up for connection field in connection page.
	 When the user clicks on the button, invoke the lookup service and populate the data in a dropdown format. 
	 Toggle between hiding and showing the dropdown content. */
	function lookupFunction(element, targetElement, lookupService, form) {
			
		$.fn.serializeForm = function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name]) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		};
		
		clearDropdown();
			
		var dataFields = $('form').serializeForm();
		dataFields["serviceName"] = lookupService;
			
		$.ajax({
			url: "/invoke/wm.cloudstreams.connection.ui:fieldLookup",
			data: dataFields,
			type: 'post',
			dataType: "json",
				
			success: function(data) {
				$(element).after(getDropdown()); // adds dropdown div
				var valuesArray = data['values'];
				if(valuesArray) {
					valuesArray.forEach(function(sandbox) {
						var option = document.createElement("span");
						var displayNameExists = (sandbox['displayName'] != null);
						var descriptionExists = (sandbox['description'] != null);
							
						option.innerHTML = sandbox['name'] + ( displayNameExists? " | <strong>" + sandbox['displayName'] + "</strong>" : "");
						option.setAttribute('name', sandbox['name']);
						if(descriptionExists) {
							option.setAttribute('title', sandbox['description']);
						}
						option.setAttribute('targetElement', targetElement);

						getDropdown().appendChild(option);

						$(option).click(function(e) {
							if (this.hasAttribute('targetElement')) {
								$('input[name="' + this.getAttribute('targetElement') + '"]').val(this.getAttribute('name'));
								clearDropdown();
							}
						});
					});

					if (!isDropdownVisible())
						toggleDropdown();
				} else {
					var errorMessage = data['error'];
					renderErrorMessage(element, document, errorMessage);
				}
			},
			error: function(request, status, error) {
				jsonValue = jQuery.parseJSON( request.responseText );
				
				var errorPipeline = jsonValue['$errorInfo'].$pipeline;
				var errorMessage = "";
				errorPipeline= undefined;
				if(errorPipeline) {
					errorMessage = errorPipeline.error;
				} else {
					errorMessage = jsonValue['$errorInfo'].$error;
					errorMessage = errorMessage.substring(errorMessage.indexOf(":") + 1).trim();
				}
				
				renderErrorMessage(element, document, errorMessage);
			}
		});
	}
	
	function renderErrorMessage(element, document, errorMessage) {
		
		var p = document.createElement('div');
		p.innerHTML = errorMessage;
		p.setAttribute("class", "dynamicLookupError");
		p.style.color = "red";
		p.style.marginTop = "5px";
		$(p).insertAfter(element);
	}

	function isDropdownVisible() {
		if (document.getElementById("dropdownContainer") == undefined)
			return false;
		return document.getElementById("dropdownContainer").classList.contains("show");
	}

	function createDropdown() {
		var dropdown_div = document.createElement("div");
		dropdown_div.classList.add("dropdown-content");
		dropdown_div.id = "dropdownContainer";
		return dropdown_div;
	}

	function getDropdown() {
		if (document.getElementById("dropdownContainer") != undefined) {
			return document.getElementById("dropdownContainer");
		} else {
			return createDropdown();
		}
	}

	function toggleDropdown() {
		getDropdown().classList.toggle("show");
	}

	function clearDropdown() {
		if (document.getElementById("dropdownContainer") != undefined) {
			document.getElementById("dropdownContainer").innerHTML = "";
			document.getElementById("dropdownContainer").classList.toggle("show");
		}
		$('.dynamicLookupError').remove(); // clear load errors
	}

/** ****** Dropdown related functions ends ******** */