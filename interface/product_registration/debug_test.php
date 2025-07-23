<?php
/**
 * Debug test page for product registration
 */

require_once("../../interface/globals.php");

use OpenEMR\Services\ProductRegistrationService;

// Check if user is super admin
$isSuperAdmin = AclMain::aclCheckCore('admin', 'super');
$productRegistration = new ProductRegistrationService();
$product_row = $productRegistration->getProductDialogStatus();

?>
<!DOCTYPE html>
<html>
<head>
    <title>Product Registration Debug Test</title>
    <script src="<?php echo $web_root; ?>/library/js/jquery-3-6-0.min.js"></script>
    <script src="<?php echo $web_root; ?>/library/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="<?php echo $web_root; ?>/library/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-4">
        <h2>Product Registration Debug Test</h2>
        
        <div class="card">
            <div class="card-header">
                <h4>Debug Information</h4>
            </div>
            <div class="card-body">
                <p><strong>Is Super Admin:</strong> <?php echo $isSuperAdmin ? 'Yes' : 'No'; ?></p>
                <p><strong>Allow Register Dialog:</strong> <?php echo $product_row['allowRegisterDialog'] ?? 'Not set'; ?></p>
                <p><strong>Allow Email:</strong> <?php echo $product_row['allowEmail'] ?? 'Not set'; ?></p>
                <p><strong>Allow Telemetry:</strong> <?php echo $product_row['allowTelemetry'] ?? 'Not set'; ?></p>
                <p><strong>Current Version:</strong> <?php echo (new \OpenEMR\Services\VersionService())->asString(); ?></p>
                <p><strong>Last Ask Version:</strong> <?php echo $product_row['last_ask_version'] ?? 'Not set'; ?></p>
                <p><strong>Email:</strong> <?php echo $product_row['email'] ?? 'Not set'; ?></p>
                <p><strong>Telemetry Disabled:</strong> <?php echo $product_row['telemetry_disabled'] ?? 'Not set'; ?></p>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                <h4>Test Buttons</h4>
            </div>
            <div class="card-body">
                <button type="button" class="btn btn-primary" id="testSubmit">Test Submit Button</button>
                <button type="button" class="btn btn-secondary" id="testNotThanks">Test Not Thanks Button</button>
            </div>
        </div>

        <div class="card mt-3">
            <div class="card-header">
                <h4>Console Log</h4>
            </div>
            <div class="card-body">
                <div id="consoleLog" style="background: #f8f9fa; padding: 10px; height: 200px; overflow-y: auto; font-family: monospace;"></div>
            </div>
        </div>
    </div>

    <script>
        // Override console.log to also display in our debug area
        const originalLog = console.log;
        console.log = function(...args) {
            originalLog.apply(console, args);
            const logDiv = document.getElementById('consoleLog');
            const logEntry = document.createElement('div');
            logEntry.textContent = new Date().toLocaleTimeString() + ': ' + args.join(' ');
            logDiv.appendChild(logEntry);
            logDiv.scrollTop = logDiv.scrollHeight;
        };

        // Test button handlers
        document.getElementById('testSubmit').addEventListener('click', function() {
            console.log('Test submit button clicked');
        });

        document.getElementById('testNotThanks').addEventListener('click', function() {
            console.log('Test not thanks button clicked');
        });

        // Test AJAX call
        console.log('Testing AJAX call to product registration controller...');
        $.ajax({
            url: '<?php echo $web_root; ?>/interface/product_registration/product_registration_controller.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                console.log('AJAX GET success:', response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('AJAX GET error:', textStatus, errorThrown);
                console.log('Response:', jqXHR.responseText);
            }
        });
    </script>
</body>
</html> 