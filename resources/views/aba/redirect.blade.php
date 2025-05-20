<form id="abaForm" method="POST" action="{{ $apiUrl }}">
    @foreach ($data as $key => $value)
        <input type="hidden" name="{{ $key }}" value="{{ $value }}">
    @endforeach
</form>

<script>
    document.getElementById('abaForm').submit();
</script>
