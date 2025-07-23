/**
 * ProductRegistrationController (JavaScript)
 *
 * @package OpenEMR
 * @link    http://www.open-emr.org
 * @author  Matthew Vita <matthewvita48@gmail.com>
 * @author  Jerry Padgett <sjpadgett@gmail.com>
 * @license     https://github.com/openemr/openemr/blob/master/LICENSE GNU General Public License 3
 */

"use strict";

function ProductRegistrationController() {
    const _closeModal = function (closeWaitTimeMilliseconds) {
        setTimeout(function () {
            $('.product-registration-modal').modal('toggle');
        }, closeWaitTimeMilliseconds || 0);
    };
    const _registrationFailedHandler = function (error) {
        $('#submit_registration_loader').hide();
        $('.product-registration-modal .message').text(error);
    };
    const _registrationCreatedHandler = function (data) {
        // If telemetry is enabled, set the telemetryEnabled flag
        if (data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'telemetry_enabled') && data.telemetry_enabled) {
            top.telemetryEnabled = 1;
        }
        _closeModal();
    };
    const _formCancellationHandler = function () {
        _closeModal();
        // Ask later by user. Handle by ignoring the registration.
        top.restoreSession();
    };
    const _formSubmissionHandler = function () {
        console.log('Form submission handler called');
        let email = $('.product-registration-modal .email').val() || null;
        if (email > '' && email.indexOf('@') < 0) {
            $('.product-registration-modal .message').text(registrationTranslations.pleaseProvideValidEmail);
            $('.product-registration-modal .email').focus();
            return false;
        }

        $('#submit_registration_loader').show();

        $('.product-registration-modal .message').text('');
        // Read the checkbox values; use 1 for checked, 0 otherwise.
        let allowTelemetry = $('.product-registration-modal #allowTelemetry').is(':checked') ? 1 : 0;
        // Build the data object to send to the service
        const formData = {
            email: email,
            allow_telemetry: allowTelemetry,
        };

        console.log('Submitting form data:', formData);

        _productRegistrationService.submitRegistration(formData, function (err, data) {
            console.log('Registration callback - error:', err, 'data:', data);
            if (err) {
                return _registrationFailedHandler(err);
            }
            _registrationCreatedHandler(data);
        });
    };

    const self = this;

    const _productRegistrationService = new ProductRegistrationService();

    self.getProductRegistrationStatus = function (callback) {
        _productRegistrationService.getProductStatus(function (err, data) {
            if (err) {
                return callback(err, null);
            }
            callback(null, data);
        });
    };

    self.showProductRegistrationModal = function () {
        _displayFormView();
    };

    const _displayFormView = function () {
        console.log('_displayFormView called');

        // Check if modal exists
        const modal = $('.product-registration-modal');
        if (modal.length === 0) {
            console.error('Product registration modal not found!');
            return;
        }

        // Update modal header with title
        $('.product-registration-modal .modal-header').text(registrationTranslations.title);

        // Remove any existing event handlers to prevent duplicates
        $('.product-registration-modal .submit').off('click');
        $('.product-registration-modal .nothanks').off('click');
        $('.product-registration-modal .email').off('keypress');

        // Wire up button handlers
        $('.product-registration-modal .submit').on('click', function (e) {
            console.log('Submit button clicked');
            e.preventDefault();
            e.stopPropagation();
            _formSubmissionHandler();
            return false;
        });

        $('.product-registration-modal .nothanks').on('click', function (e) {
            console.log('Not thanks button clicked');
            e.preventDefault();
            e.stopPropagation();
            _formCancellationHandler();
            return false;
        });

        // Toggle the modal display
        console.log('Toggling modal display');
        $('.product-registration-modal').modal('toggle');

        // Check if modal is visible after toggle
        setTimeout(function () {
            const modal = $('.product-registration-modal');
            console.log('Modal visible:', modal.hasClass('show'));
            console.log('Modal display style:', modal.css('display'));
            console.log('Modal z-index:', modal.css('z-index'));
        }, 100);

        // Handle enter key on the email field
        $('.product-registration-modal .email').on('keypress', function (event) {
            if (event.which === 13) {
                _formSubmissionHandler();
                return false;
            }
        });
    };
}
