$(document).ready(function () {
    window.displayContentDashboard = function displayContentDashboard() {
        const dvContentDashboard = document.getElementById('id-conent-dashboard');

        dvContentDashboard.innerHTML = `
            <div class="row">
                <!-- First Row with Cards -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-top">
                    <div class="dashboard-box p-4 bg-primary text-white rounded">
                        <div class="d-flex align-items-center justify-content-around">
                            <i class="fa fa-shopping-cart fa-3x me-3" aria-hidden="true"></i>
                            <div class="text-end">
                                <h6>Today Sale</h6>
                                <h5>$12555.00</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-top">
                    <div class="dashboard-box p-4 bg-success text-white rounded">
                        <div class="d-flex align-items-center justify-content-around">
                            <i class="fa fa-line-chart fa-3x me-3" aria-hidden="true"></i>
                            <div class="text-end">
                                <h6>Total Sale</h6>
                                <h4>$1224.00</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Second Row with Cards -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-right">
                    <div class="dashboard-box p-4 bg-warning text-white rounded">
                        <div class="d-flex align-items-center justify-content-around">
                            <i class="fa fa-users fa-3x me-3" aria-hidden="true"></i>
                            <div class="text-end">
                                <h6>Users</h6>
                                <h4>1500</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-right">
                    <div class="dashboard-box p-4 bg-danger text-white rounded">
                        <div class="d-flex align-items-center justify-content-around">
                            <i class="fa fa-cart-arrow-down fa-3x me-3" aria-hidden="true"></i>
                            <div class="text-end">
                                <h6>Orders</h6>
                                <h4>350</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Section products Near Orders -->
                <div class="col-lg-3 col-md-6 col-sm-12 mb-4 slide-in-right">
                    <div class="dashboard-box p-4 bg-info text-white rounded">
                        <div class="d-flex align-items-center justify-content-around">
                            <i class="fa fa-cube fa-3x me-3" aria-hidden="true"></i>
                            <div class="text-end">
                                <h6>Products</h6>
                                <h4>250</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Second Row with Charts -->
            <div class="row">
                <div class="col-lg-6 col-md-12 mb-4 slide-in-left">
                    <div class="chart-box p-3">
                        <h5 class="text-center">Pie Chart</h5>
                        <canvas id="pieChart" style="width: 100%; height: 100px;"></canvas>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 mb-4 slide-in-right">
                    <div class="chart-box p-3">
                        <h5 class="text-center">Column Chart</h5>
                        <canvas id="columnChart" style="width: 100%; height: 300px;"></canvas>
                    </div>
                </div>
            </div>

                <!-- Third Row with Table -->
                <div class="row">
                    <div class="col-12 slide-in-left">
                        <div class="table-responsive mt-4">
                            <h5 class="text-center">Orders Summary</h5>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>12345</td>
                                        <td>John Doe</td>
                                        <td>$150.00</td>
                                        <td>Processing</td>
                                        <td>2023-01-01</td>
                                    </tr>
                                    <!-- Additional rows as needed -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>    
            </div>
        `;

        // Initialize Pie Chart
        const pieChartCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieChartCtx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow'],
                datasets: [{
                    label: 'My Pie Chart',
                    data: [300, 50, 100],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverOffset: 4
                }]
            }
        });

        // Initialize Column Chart
        const columnChartCtx = document.getElementById('columnChart').getContext('2d');
        new Chart(columnChartCtx, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                datasets: [{
                    label: 'Revenue',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: '#36A2EB',
                    borderColor: '#36A2EB',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
