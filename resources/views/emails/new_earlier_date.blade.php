<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Earlier Date Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            color: #007bff;
        }
        .date-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Earlier Dates Found!</h1>
        <p>Hello,</p>
        <p>The following new, earlier appointment dates have been detected by the system:</p>
        @foreach ($earlierDatums as $datum)
            <div class="date-info" style="margin-bottom: 15px;">
                <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($datum['date'])->format('d/m/Y') }}</p>
                <p><strong>Info:</strong> {{ $datum['text'] }}</p>
            </div>
        @endforeach
        <p>Please check the booking website to see if you can secure this new slot.</p>
        <p>Thank you,</p>
        <p>Your Friendly Bot</p>
    </div>
</body>
</html>
