<!DOCTYPE html>
<html lang="km">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ការទូទាត់ត្រូវបានលុបចោល</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5 text-center">
        <div class="alert alert-warning" role="alert">
            <h4 class="alert-heading">ការទូទាត់ត្រូវបានលុបចោល!</h4>
            <p>ការទូទាត់សម្រាប់ការបញ្ជាទិញលេខ <strong>{{ $order_id }}</strong> ត្រូវបានលុបចោល។</p>
            <hr>
            <p class="mb-0">ប្រសិនបើអ្នកមានបញ្ហា សូមព្យាយាមម្តងទៀត ឬទាក់ទងមកយើងខ្ញុំ។</p>
            <a href="/checkout" class="btn btn-primary mt-3">ព្យាយាមម្តងទៀត</a>
            <a href="/" class="btn btn-secondary mt-3">ត្រឡប់ទៅទំព័រដើម</a>
        </div>
    </div>
</body>
</html>