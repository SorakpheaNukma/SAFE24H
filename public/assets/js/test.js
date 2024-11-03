
/*
    function sort_table(id, fn, pageLength_,message) {
        $('.jconfirm-holder').width($('.jconfirm-open').width());
        let pageLength = 10;
        if (pageLength_) pageLength = pageLength_;
        if (!fn) fn = "Export";
        if (!message) message = "";

        $(id).dataTable({
            dom: 'Bfrtip',
            "pageLength": pageLength,
            buttons: [
                {
                    extend: 'copyHtml5',
                    title: fn
                },
                {
                    extend: 'excelHtml5',
                    title: fn,
                    messageTop: message,
                },
                //{
                //    extend: 'pdfHtml5', // Add the PDF export button
                //    title: fn,
                //    customize: function (doc) {
                //        // You can customize the PDF document here if needed
                //    }
                //}
            ],

            "order": [],
            "language": {
                "decimal": "",
                "emptyTable": "Không có dữ liệu",
                "info": "Hiển thị từ dòng _START_ đến dòng _END_ trong tổng số _TOTAL_ dòng",
                "infoEmpty": "Showing 0 to 0 of 0 entries",
                "infoFiltered": "(filtered from _MAX_ total entries)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Show _MENU_ entries",
                "loadingRecords": "Loading...",
                "processing": "Processing...",
                "search": "Tìm kiếm:",
                "zeroRecords": "Không tìm thấy lớp nào phù hợp",
                "paginate": {
                    "first": "Trang đầu",
                    "last": "Trang cuối",
                    "next": "Trang sau",
                    "previous": "Trang trước"
                },
                "aria": {
                    "sortAscending": ": Sắp xếp tăng dần",
                    "sortDescending": ": Sắp xếp giảm dần"
                }
            }
        });
        $('.jconfirm-holder').width($('.jconfirm-open').width());
    }
*/