function ScormXBlock(runtime, element, settings) {

  function SCORM_12_API(){

    this.LMSInitialize = function(){
      return "true";
    };

    this.LMSFinish = function() {
      return "true";
    };

    this.LMSGetValue = GetValue;
    this.LMSSetValue = SetValue;

    this.LMSCommit = function() {
        return "true";
    };

    this.LMSGetLastError = function() {
      return "0";
    };

    this.LMSGetErrorString = function(errorCode) {
      return "Some Error";
    };

    this.LMSGetDiagnostic = function(errorCode) {
      return "Some Diagnostice";
    }
  }

  function SCORM_2004_API(){
    this.Initialize = function(){
      return "true";
    };

    this.Terminate = function() {
      return "true";
    };

    this.GetValue = GetValue;
    this.SetValue = SetValue;

    this.Commit = function() {
        return "true";
    };

    this.GetLastError = function() {
      return "0";
    };

    this.GetErrorString = function(errorCode) {
      return "Some Error";
    };

    this.GetDiagnostic = function(errorCode) {
      return "Some Diagnostice";
    }
  }

  var GetValue = function (cmi_element) {
    var handlerUrl = runtime.handlerUrl(element, 'scorm_get_value');

    var response = $.ajax({
      type: "POST",
      url: handlerUrl,
      data: JSON.stringify({'name': cmi_element}),
      async: false
    });
    response = JSON.parse(response.responseText);
    return response.value
  };

  var SetValue = function (cmi_element, value) {
    var handlerUrl = runtime.handlerUrl( element, 'scorm_set_value');

    $.ajax({
      type: "POST",
      url: handlerUrl,
      data: JSON.stringify({'name': cmi_element, 'value': value}),
      async: false,
      success: function(response){
        if (typeof response.lesson_score != "undefined"){
          $(".lesson_score", element).html(response.lesson_score);
        }
        $(".completion_status", element).html(response.completion_status);
      }
    });

    return "true";
  };

  $(function ($) {
    if (settings.version_scorm == 'SCORM_12') {
      API = new SCORM_12_API();
    } else {
      API_1484_11 = new SCORM_2004_API();
    }
    var popupWindow = null;
    function showPopup(params) {
      if( popupWindow == null || popupWindow.closed){
        popupWindow = window.open(settings.scorm_file_path, settings.scorm_xblock.display_name, params);
      } else {
        popupWindow.focus();
      }
    };
    var width = settings.scorm_xblock.width ? settings.scorm_xblock.width : screen.height;
    var height = settings.scorm_xblock.height;
    var params = 'width='+width+', height='+height+', top='+((screen.height-height)/2)+',left='+((screen.width-width)/2)+', resizable=yes, scrollbars=no, status=yes'
    if (settings.scorm_xblock.popup){
      showPopup(params);
    }
    $('.scorm_launch', element).on( "click", function() {
      showPopup(params);
    })
  });
}
