'use strict';

const validateForm = function(cb) {
    $form = $('.js-settings-form');

    $form.validate({
        submitHandler: function(form) { },
        errorPlacement: function () { },
    });

    cb($form);
};

const connection = new Postmonger.Session();
let authTokens = {};
let payload = {};
let $form;
$(window).ready(onRender);

//Broadcast phản hồi ready event đầu tiên được gọi bởi tùy chỉnh ứng dụng. Điều này thường được thực hiện trên 
connection.on('initActivity', initialize);
//Broadcast phản hồi  đến requestTokens event được gọi bởi ứng dụng tùy chỉnh.
//Journey Builder trả lại một đối tượng chứa cả mã thông báo kế thừa và mã thông báo Fuel2.
connection.on('requestedTokens', onGetTokens);
//Broadcast phản hồi  đến requestEndpoints event được gọi bởi ứng dụng tùy chỉnh. 
//Journey Builder trả lại một đối tượng có chứa URL máy chủ REST.
connection.on('requestedEndpoints', onGetEndpoints);

//Phát khi nextButton được nhấn trong confignation modal.
//Activity sẽ phản hồi bằng cách gọi nextStep 
//(hoặc ready, nếu xác thực không thành công và hoạt động tùy chỉnh muốn ngăn điều hướng sang bước tiếp theo).
connection.on('clickedNext', save);

const buttonSettings = {
    button: 'Send',
    text: 'Send',
    visible: true,
    enabled: false,
};

function onRender() {
    connection.trigger('ready');
    //Trong response Journey Builder phát requestedTokens với tokens được trả lại 
    connection.trigger('requestTokens');
    //Journey Builder phát rộng requestendPoint với REST endpoint được trả lại  
    connection.trigger('requestEndpoints');

    // validation
    validateForm(function($form) {
        $form.on('change click keyup input paste', 'input, textarea', function () {
            buttonSettings.enabled = $form.valid();
            connection.trigger('updateButton', buttonSettings);
        });
    });
}

/**
 * Initialization
 * @param data
 */
function initialize(data) {
    if (data) {
        payload = data;
    }
    const hasInArguments = Boolean(
        payload['arguments'] &&
        payload['arguments'].execute &&
        payload['arguments'].execute.inArguments &&
        payload['arguments'].execute.inArguments.length > 0
    );

    const inArguments = hasInArguments
        ? payload['arguments'].execute.inArguments
        : {};

    $.each(inArguments, function (index, inArgument) {
        $.each(inArgument, function (key, value) {
            const $el = $('#' + key);
            if($el.attr('type') === 'checkbox') {
                $el.prop('checked', value === 'true');
            } else {
                $el.val(value);
            }
        });
    });

    validateForm(function($form) {
        buttonSettings.enabled = $form.valid();
        connection.trigger('updateButton', buttonSettings);
    });
}

/**
 *
 *
 * @param {*} tokens
 */
function onGetTokens(tokens) {
    authTokens = tokens;
}

/**
 *
 *
 * @param {*} endpoints
 */
function onGetEndpoints(endpoints) {
    console.log(endpoints);
}

/**
 * Save settings
 */
function save() {
    if($form.valid()) {
        payload['metaData'].isConfigured = true;

        payload['arguments'].execute.inArguments = [
            {
                "contactKey": "{{Contact.Key}}"
            }
        ];

        $('.js-activity-setting').each(function () {
            const $el = $(this);
            const setting = {
                id: $(this).attr('id'),
                value: $(this).val()
            };

            $.each(payload['arguments'].execute.inArguments, function(index, value) {
                if($el.attr('type') === 'checkbox') {
                    if($el.is(":checked")) {
                        value[setting.id] = setting.value;
                    } else {
                        value[setting.id] = 'false';
                    }
                } else {
                    value[setting.id] = setting.value;
                }
            })
        });

        connection.trigger('updateActivity', payload);
    }
}


