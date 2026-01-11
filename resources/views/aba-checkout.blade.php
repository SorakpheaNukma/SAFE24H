<!-- resources/views/aba-checkout.blade.php -->
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"><title>Redirecting to ABA PayWay...</title></head>
  <body>
    <form id="abaForm" method="POST" action="{{ $action }}">
      @csrf <!-- không cần token ABA, nhưng an toàn -->
      @foreach($payload as $key => $value)
        <input type="hidden" name="{{ $key }}" value="{{ $value }}">
      @endforeach
      <input type="hidden" name="X-Signature" value="{{ $signature }}">
    </form>
    <script>document.getElementById('abaForm').submit();</script>
  </body>
</html>