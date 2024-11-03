<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8f9fa;
        }

        .error-container {
            text-align: center;
            max-width: 600px;
            padding: 40px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .error-code {
            font-size: 100px;
            font-weight: bold;
            color: #ff6b6b;
        }

        .error-message {
            font-size: 24px;
            margin-bottom: 20px;
        }

        .home-button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
        }
    </style>
</head>

<body>

    <div class="error-container">
        <div class="error-code">404</div>
        <p class="error-message">Oops! The page you are looking for was not found.</p>
        <a href="/" class="home-button">Back to Home</a>
    </div>

</body>

</html>