-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2025 at 03:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_skincare`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `created_at`, `updated_at`) VALUES
(1, 'Mask', '2024-10-08 11:59:50', '2024-10-08 11:59:50'),
(2, 'Uniform', '2025-03-05 07:42:11', '2025-03-05 07:42:11'),
(3, 'អាវឈុតប្រុស', '2025-03-07 00:29:26', '2025-03-07 00:29:26'),
(4, 'អាវឈុតស្រី', '2025-03-07 00:29:41', '2025-03-07 00:29:41'),
(5, 'អាវចុងភៅ', '2025-03-07 01:59:14', '2025-03-07 01:59:14'),
(6, 'ឈុត VIP', '2025-03-07 02:05:46', '2025-03-07 02:15:18');

-- --------------------------------------------------------

--
-- Table structure for table `invalidated_tokens`
--

CREATE TABLE `invalidated_tokens` (
  `id_tk` int(10) UNSIGNED NOT NULL,
  `access_tk` text NOT NULL,
  `expired_tk` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invalidated_tokens`
--

INSERT INTO `invalidated_tokens` (`id_tk`, `access_tk`, `expired_tk`, `created_at`, `updated_at`) VALUES
(1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3Mjk0ODYzMDgsImV4cCI6MTc2MTAyMjMwOCwibmJmIjoxNzI5NDg2MzA4LCJqdGkiOiI2aXdPb21GbXc5dmJkbDJEIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.CDG8znBIsq5Kxb5TXS3JrhkQBtXIgWwiZzo2v4kfog0', '2025-10-20 21:51:48', '2024-10-20 21:57:50', '2024-10-20 21:57:50'),
(2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDExNzEyOTAsImV4cCI6MTc3MjcwNzI5MCwibmJmIjoxNzQxMTcxMjkwLCJqdGkiOiJiSXBYV3g5NjBXOEtEamFDIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.1qCQGmuyyxVmn4a2nrr2Ns8H_kPyuJ3B_Nd8xALDWQk', '2026-03-05 03:41:30', '2025-03-05 03:43:20', '2025-03-05 03:43:20'),
(3, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDExNzE0MTksImV4cCI6MTc3MjcwNzQxOSwibmJmIjoxNzQxMTcxNDE5LCJqdGkiOiJXQzlNb1FMdmE4aGxmTEV5Iiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rlO-opXTHp4WL7bjW81Q3lvKzGM_54I5umjsw794VGM', '2026-03-05 03:43:39', '2025-03-05 03:45:51', '2025-03-05 03:45:51'),
(4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDExNzE1NjQsImV4cCI6MTc3MjcwNzU2NCwibmJmIjoxNzQxMTcxNTY0LCJqdGkiOiJpVGJFSE5ybFRra3BjY2M1Iiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.HNCXLcdg53vgBj5GqdQy86G7QAfZ74gNDSyZIW5Xf3k', '2026-03-05 03:46:04', '2025-03-05 03:46:34', '2025-03-05 03:46:34'),
(5, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDExNzE2MDUsImV4cCI6MTc3MjcwNzYwNSwibmJmIjoxNzQxMTcxNjA1LCJqdGkiOiJEREdHZXBUNkowME1KSnVrIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.n5L8fGY_CgPctamMuoDOBorgQOd_JpMeLmTb-bASkhM', '2026-03-05 03:46:45', '2025-03-05 07:29:07', '2025-03-05 07:29:07'),
(6, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDExODQ5NjUsImV4cCI6MTc3MjcyMDk2NSwibmJmIjoxNzQxMTg0OTY1LCJqdGkiOiJYTUYxUEdmQVhBMEZ4Q0VuIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.8DP7we-t6tYCuRjO60eXHUa_fEt2ku8iiGsmg5fyqNQ', '2026-03-05 07:29:25', '2025-03-05 07:44:17', '2025-03-05 07:44:17'),
(7, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDExODU4NjcsImV4cCI6MTc3MjcyMTg2NywibmJmIjoxNzQxMTg1ODY3LCJqdGkiOiJXcHdBbVlvRkdYRWpyMmd0Iiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.jSUkYYs96aisMYehszma78J2M7xzUAtFITA3TgmcSnU', '2026-03-05 07:44:27', '2025-03-05 07:47:23', '2025-03-05 07:47:23'),
(8, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDExODYwNTEsImV4cCI6MTc3MjcyMjA1MSwibmJmIjoxNzQxMTg2MDUxLCJqdGkiOiJmY1dzTzF1QkxHWk80UHpnIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.pqQ8XcpRrZrRfJqwOVjdx2icH2UBQBh08qC3k52oKJ0', '2026-03-05 07:47:31', '2025-03-06 23:37:53', '2025-03-06 23:37:53'),
(9, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDEzMzA3NjUsImV4cCI6MTc3Mjg2Njc2NSwibmJmIjoxNzQxMzMwNzY1LCJqdGkiOiJ3T0tFN3JoUmVsWE10dzdFIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.XXAMTfY3f6cWxn4eVleU3mydDy8NhNTJ9Oil4xm_K-8', '2026-03-06 23:59:25', '2025-03-07 02:15:33', '2025-03-07 02:15:33');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(3, '2024_09_09_142158_invalided_token', 1),
(4, '2024_09_09_150605_category', 1),
(5, '2024_09_10_072541_create_products_table', 1),
(6, '2024_09_10_080820_create_orders_table', 1),
(7, '2024_09_10_095047_payment', 1),
(8, '2024_09_16_142642_create_product_images_table', 1),
(9, '2024_10_16_155707_add_otp_to_users_table', 1),
(10, '2024_10_18_075303_create_carts_table', 1),
(11, '2024_10_18_081038_add_columns_to_users_table', 1),
(12, '2024_10_26_103849_create_order_items_table', 1),
(13, '2024_10_27_045112_create_push_notification_browsers_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `total_amount` double(8,2) NOT NULL,
  `status` varchar(255) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `order_date`, `created_at`, `updated_at`) VALUES
(1, 2, 10.00, 'shipped', '2025-03-05 14:29:46', '2025-03-05 03:45:36', '2025-03-05 07:29:46'),
(2, 2, 20.00, 'shipped', '2025-03-05 14:29:53', '2025-03-05 03:47:10', '2025-03-05 07:29:53'),
(4, 2, 10.00, 'shipped', '2025-03-05 14:53:19', '2025-03-05 07:47:07', '2025-03-05 07:53:19'),
(5, 2, 20.00, 'delivered', '2025-03-07 07:30:36', '2025-03-07 00:30:12', '2025-03-07 00:30:36'),
(7, 2, 10.00, 'processing', '2025-03-07 08:36:42', '2025-03-07 01:36:43', '2025-03-07 01:36:43');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`item_id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 10.00, '2025-03-05 03:45:36', '2025-03-05 03:45:36'),
(2, 2, 1, 2, 10.00, '2025-03-05 03:47:10', '2025-03-05 03:47:10'),
(4, 4, 1, 1, 10.00, '2025-03-05 07:47:08', '2025-03-05 07:47:08'),
(5, 5, 1, 2, 10.00, '2025-03-07 00:30:13', '2025-03-07 00:30:13'),
(7, 7, 1, 1, 10.00, '2025-03-07 01:36:43', '2025-03-07 01:36:43');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `cash_on_delivery` tinyint(1) NOT NULL,
  `total_amount_paid` double(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(10) UNSIGNED NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_price` double(10,2) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `sold` int(11) DEFAULT 0,
  `des_1` varchar(255) DEFAULT NULL,
  `des_2` varchar(255) DEFAULT NULL,
  `des_3` varchar(255) DEFAULT NULL,
  `des_4` varchar(255) DEFAULT NULL,
  `des_5` varchar(255) DEFAULT NULL,
  `des_6` varchar(255) DEFAULT NULL,
  `des_7` varchar(255) DEFAULT NULL,
  `des_8` varchar(255) DEFAULT NULL,
  `des_9` varchar(255) DEFAULT NULL,
  `des_10` varchar(255) DEFAULT NULL,
  `des_11` varchar(255) DEFAULT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_price`, `quantity`, `sold`, `des_1`, `des_2`, `des_3`, `des_4`, `des_5`, `des_6`, `des_7`, `des_8`, `des_9`, `des_10`, `des_11`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'CeraVe', 10.00, 4, 6, 'ប្រភេទសាច់ជែលស្រួលលាប ត្រជាក់ ទប់ខ្លាញ់បានល្អ', 'ធននឹងទឹក ធននឹងញើស មិនស្ងួតស្បែក', 'មិនមានផលរំខាន អ្វីដែលសំខាន់មិនរើសស្បែកមុខខ្លាំងពេកទេ', 'ស្បែកស្ងួតធម្មតា ខ្លាញ់តិចៗ ស្បែកធម្មតា រឺ Combo អាចប្រើបាន', 'ចំណុះ ធំ គុណភាពល្អ តំលៃសមរម្យ', 'ការពារកំដៅថ្ងៃបានខ្ពស់ SPF 50+​ PA++++', 'សមស្រប គ្រប់ប្រភេទស្បែក', 'ជាប្រភេទសាច់ជែល ងាយស្រួលលាប', 'លាបហើយមិនស្អិត ជ្រាបចូលស្បែកមុខបានល្អ', 'ធានាជូនផលិតផលជប៉ុនសុទ្ធ100%', NULL, 1, '2024-10-08 12:06:10', '2025-03-07 01:36:43'),
(2, 'Amino Acid', 20.00, 30, 0, 'Sleeping mask', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2024-10-20 06:15:19', '2024-10-20 06:15:19'),
(4, 'អាវ', 12.00, 49, 1, 'DOCTOR', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-03-05 07:43:53', '2025-03-05 07:45:15'),
(5, 'ឈុតបុរស', 12.00, 20, 0, 'ប្រម៉ូសិន ទិញ 2ឈុត', 'ឈុតទី2នៅសល់ត្រឹមតែ $12', 'ប្រូម៉ូសិននេះគិតត្រឹមថ្ងៃទី 25ខែ12 នេះទេណាបង អូន👌', 'អាចមកសាក ល នឹងកុម្មង់ដឹកជូនដល់ផ្ទះបានណា', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-03-07 00:06:13', '2025-03-07 00:06:13'),
(6, 'Nure', 21.90, 99, 0, 'ឈុតសម្រាប់នារី', 'មានគ្រប់ទំហំsize S.M.L.XL', 'ឈុតម៉ូតថ្មី ពណ៌ថ្មី សាច់រលាស់ទន់ត្រជាក់ស្រួលស្លៀកពាក់​ 🥰 😊', 'បង ប្អូនពេញចិត្តអាចអញ្ជើញមកមើលផ្ទាល់នៅហាង ឬកម្មង់ដឹកក៏បាន', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-03-07 00:11:28', '2025-03-07 00:11:28'),
(7, 'Nurse 1', 21.90, 22, 0, 'មកដល់ទៀតថ្មីទៀតហេីយ💥In stock💥', '🆕️ ឈុតសម្រាប់នារី​ មានគ្រប់ទំហំsize S.M.L.XL', 'ឈុតម៉ូតថ្មី ពណ៌ថ្មី សាច់រលាស់ទន់ត្រជាក់ស្រួលស្លៀកពាក់​ 🥰 😊', 'បង ប្អូនពេញចិត្តអាចអញ្ជើញមកមើលផ្ទាល់នៅហាង ឬកម្មង់ដឹកក៏បាន', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-03-07 00:16:17', '2025-03-07 00:16:17'),
(8, 'Nurse 2', 21.90, 55, 0, '💥In stock💥 🆕️ New Arrivals 😊 គឺថាស្តុកពេញៗចឹងហ្មង', '😁វឺតៗបងអូន ជិតផុតប្រម៉ូសិនហើយ មានគ្រប់ទំហំ ហើយម៉ូតខ្លះក៏អស់ខ្លះដែរ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-03-07 00:19:25', '2025-03-07 00:19:25'),
(11, 'អាវចុងភៅពណ៌ស ដៃវែង (សាច់លេខ១)', 29.00, 0, 0, 'អាវចុងភៅពណ៌ស ដៃវែង (សាច់លេខ១)', 'ផលិតផលខ្មែរ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2025-03-07 01:56:21', '2025-03-07 01:56:21'),
(12, 'អាវចុងភៅ', 13.00, 14, 0, 'អាវចុងភៅពណ៌ខ្មៅ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2025-03-07 02:00:56', '2025-03-07 02:00:56'),
(13, 'VIPឈុតនារី', 17.52, 20, 0, 'ពណ៌សំបកឪឡឹក', 'ផលិតផលកូនខ្មែរ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, '2025-03-07 02:06:59', '2025-03-07 02:06:59'),
(14, 'VIP ឈុតនារី', 21.90, 53, 0, 'ពណ៍ខៀវទឹកប៊ិច', 'ផលិតផលកូនខ្មែរ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, '2025-03-07 02:10:19', '2025-03-07 02:10:19'),
(15, 'VIPឈុតនារី', 21.90, 47, 0, 'ពណ៍ហ្កិចស្រាល', 'ផលិតផលខ្មែរ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, '2025-03-07 02:14:45', '2025-03-07 02:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `product_img_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`product_img_id`, `product_id`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 1, '839bb626-81e2-4fee-9eae-5112ef93e384.png', '2024-10-08 12:06:11', '2024-10-08 12:06:11'),
(2, 2, 'fcefcc20-adac-4ad4-8277-b1749fecc69f.jpg', '2024-10-20 06:15:22', '2024-10-20 06:15:22'),
(4, 4, 'e98d7317-b649-4132-b0a9-7659b8469412.jpg', '2025-03-05 07:43:54', '2025-03-05 07:43:54'),
(5, 4, '01e1e8f9-e379-4d9e-99c2-a4040529b461.jpg', '2025-03-05 07:43:54', '2025-03-05 07:43:54'),
(6, 4, 'a2d3adcd-a784-41ee-bbd8-5b652379ad6c.jpg', '2025-03-05 07:43:54', '2025-03-05 07:43:54'),
(7, 5, '00967b36-601a-41ff-a600-0e336a44f396.jpg', '2025-03-07 00:06:14', '2025-03-07 00:06:14'),
(8, 5, 'dd7c90a0-8e2c-486e-b627-cdd37ccd4b6d.jpg', '2025-03-07 00:06:14', '2025-03-07 00:06:14'),
(11, 5, '8ea509ef-a8ec-475b-87f2-a9b5fe7fb0b9.jpg', '2025-03-07 00:06:14', '2025-03-07 00:06:14'),
(12, 6, '652a7eab-fbb9-4d10-bd77-0b140c57b315.jpg', '2025-03-07 00:11:29', '2025-03-07 00:11:29'),
(13, 6, 'a023b83d-dc5d-4832-8985-3ff358d88319.jpg', '2025-03-07 00:11:29', '2025-03-07 00:11:29'),
(14, 6, 'f6a36416-6ba4-4f0e-926e-61d364b1de6a.jpg', '2025-03-07 00:11:29', '2025-03-07 00:11:29'),
(15, 6, 'd518a53c-a560-4ed8-9034-22239dc7cb4d.jpg', '2025-03-07 00:11:29', '2025-03-07 00:11:29'),
(16, 6, '251e716f-4fdd-4019-9b98-c44b99933eb2.jpg', '2025-03-07 00:11:29', '2025-03-07 00:11:29'),
(17, 7, '2f9a10ea-c7cd-45de-9cc1-b370d2e58024.jpg', '2025-03-07 00:16:18', '2025-03-07 00:16:18'),
(18, 7, '77852586-286e-495c-9fcc-b7b95173255a.jpg', '2025-03-07 00:16:18', '2025-03-07 00:16:18'),
(19, 7, '59405081-f2b5-4e67-bae6-2504d845bde8.jpg', '2025-03-07 00:16:18', '2025-03-07 00:16:18'),
(20, 8, '7ab85fe2-ed1c-4e2e-a8be-ac5a2805e452.jpg', '2025-03-07 00:19:26', '2025-03-07 00:19:26'),
(21, 8, 'b5ac0c1c-2196-4d23-8bfc-40e9eecb1267.jpg', '2025-03-07 00:19:26', '2025-03-07 00:19:26'),
(22, 8, '3ea75364-4e8c-40b0-afc2-de8e09a5f16d.jpg', '2025-03-07 00:19:26', '2025-03-07 00:19:26'),
(23, 8, '0b5d2eb0-e457-4f6e-a3f1-c1f3b2af00cf.jpg', '2025-03-07 00:19:26', '2025-03-07 00:19:26'),
(24, 11, 'a6752fa8-37e9-4587-8ebd-2179849b99ff.jpg', '2025-03-07 01:56:21', '2025-03-07 01:56:21'),
(25, 11, '757eae13-a257-46dd-9670-e1b070e46a68.jpg', '2025-03-07 01:56:21', '2025-03-07 01:56:21'),
(26, 11, 'ee6ae54c-42ad-4c60-b3f2-18e04fe445a9.jpg', '2025-03-07 01:56:21', '2025-03-07 01:56:21'),
(27, 11, 'bcb00917-3be3-4d9d-a58f-34d9d38b8dad.jpg', '2025-03-07 01:56:21', '2025-03-07 01:56:21'),
(28, 11, '1f3346e1-139d-4567-a1a5-22cd1592ab04.jpg', '2025-03-07 01:56:21', '2025-03-07 01:56:21'),
(29, 12, 'd6516bb5-8ada-4af2-bcb5-0b2ac305e612.jpg', '2025-03-07 02:00:57', '2025-03-07 02:00:57'),
(30, 12, '087b6faf-71eb-4411-a56a-a9cc5cd1384a.jpg', '2025-03-07 02:00:57', '2025-03-07 02:00:57'),
(31, 12, '5c694b43-b02d-49e6-ad3d-ec5c8124850b.jpg', '2025-03-07 02:00:57', '2025-03-07 02:00:57'),
(32, 12, '8e47e62b-e87c-40fc-8454-1d35fa254149.jpg', '2025-03-07 02:00:57', '2025-03-07 02:00:57'),
(33, 12, '307b1116-9a03-40cb-b657-955676a70eba.jpg', '2025-03-07 02:00:57', '2025-03-07 02:00:57'),
(34, 13, '8f22b2a5-d777-4e88-87a2-26d44b36df09.jpg', '2025-03-07 02:06:59', '2025-03-07 02:06:59'),
(35, 13, '4e61e54e-6a86-449f-9f08-f09ce2238621.jpg', '2025-03-07 02:06:59', '2025-03-07 02:06:59'),
(36, 13, '5c25f363-bb5e-478a-b933-6d0947fe1a69.jpg', '2025-03-07 02:06:59', '2025-03-07 02:06:59'),
(37, 13, 'adcf7da5-ec14-4fd5-b480-fc55499dc72e.jpg', '2025-03-07 02:06:59', '2025-03-07 02:06:59'),
(38, 14, '4da58bac-b688-4834-9022-7468d0c9aed7.jpg', '2025-03-07 02:10:19', '2025-03-07 02:10:19'),
(39, 14, 'f6f890e2-4598-49b1-8941-487c968e62d7.jpg', '2025-03-07 02:10:19', '2025-03-07 02:10:19'),
(40, 14, '3d3b0cfa-ef69-4e6a-a250-0a7e5c9c8c79.jpg', '2025-03-07 02:10:19', '2025-03-07 02:10:19'),
(41, 14, 'ca31b16b-62c3-4929-96e1-f513eaaa0d3e.jpg', '2025-03-07 02:10:19', '2025-03-07 02:10:19'),
(42, 15, '20aee6b8-8f14-4123-8b47-ec5620775add.jpg', '2025-03-07 02:14:45', '2025-03-07 02:14:45'),
(43, 15, 'cd9577a4-2c04-4991-88bd-ad4c250898b8.jpg', '2025-03-07 02:14:45', '2025-03-07 02:14:45'),
(44, 15, '96a7b2ca-d478-4b72-a693-1df841c45893.jpg', '2025-03-07 02:14:45', '2025-03-07 02:14:45'),
(45, 15, '0ef1e7f0-0306-4dd4-b2d2-ba1a172420f2.jpg', '2025-03-07 02:14:45', '2025-03-07 02:14:45');

-- --------------------------------------------------------

--
-- Table structure for table `push_notification_browsers`
--

CREATE TABLE `push_notification_browsers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subscriptions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`subscriptions`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `push_notification_browsers`
--

INSERT INTO `push_notification_browsers` (`id`, `subscriptions`, `created_at`, `updated_at`) VALUES
(1, '{\"endpoint\":\"https://wns2-pn1p.notify.windows.com/w/?token=BQYAAADv6ptYWhYC254jn4FxNHeiQuO1AbDg0Vwq%2beG7m6FkCQeibJM%2bVmpfMZ05Sf0fc7kKoALZaXct1tGo2oLi7C87I8XSSaldc4sRO1NxpP9ZrJ9brC711lBczhOtamCeR%2fOuHwHzNmXhQmQAn6KIszWdWpjzvb4rydqO5KwQ6%2fWDvv8m6uP5ibm25MpGSRY2HTk4jatOH7CEzNXDBNYH2LhcXScVXXMaXFcRFPzWFM2B%2bcPB4jQrCvcYOaYNNBbkZVAI5emT8%2fQysGVm5sVkfqNe8xU9ZA2Qxu5STT0Kbks6LXb2uZFJAegsu6fzuaHNLJE5xgS1%2bLGTo4MWv9j6xceV\",\"expirationTime\":null,\"keys\":{\"p256dh\":\"BLbAB2cMWJi9u_Qi6-JnNhacnOc-9Grj5dDLUTaG16ycW9pDhP27H_8kZZWkUjXsOPvZhuGJ5iQ2JpCe-vs5Kig\",\"auth\":\"6ETqQAn3jFh0ew-IXs6beg\"}}', '2025-03-05 03:46:15', '2025-03-05 03:46:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `user_profile` varchar(255) DEFAULT NULL,
  `user_role` varchar(255) NOT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_expired_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `address` text DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `more_address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `phone_number`, `user_profile`, `user_role`, `otp`, `otp_expired_time`, `created_at`, `updated_at`, `address`, `country`, `more_address`) VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$maznh/Ay2DVOmlWHUG/8ku1Snjat3qIHmVMvyVaAuGy0v0.XZhPuW', '093483', NULL, 'admin', NULL, NULL, '2024-09-14 14:17:41', '2024-09-14 14:17:41', NULL, NULL, NULL),
(2, 'veng  ann', 'kunvengann@gmail.com', '$2y$10$9Ui7Bo8aGVgzR1ssHiA.muCJAxTUEUi5mQay6cKDsO/b1QtuY5JD2', '087498674', NULL, 'user', '838328', '2024-10-17 00:47:32', '2024-09-14 14:15:02', '2025-03-05 03:45:15', 'svay rieng', 'Cambodia', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_user_id_foreign` (`user_id`),
  ADD KEY `carts_product_id_foreign` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `invalidated_tokens`
--
ALTER TABLE `invalidated_tokens`
  ADD PRIMARY KEY (`id_tk`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `payments_order_id_foreign` (`order_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`product_img_id`),
  ADD KEY `product_images_product_id_foreign` (`product_id`);

--
-- Indexes for table `push_notification_browsers`
--
ALTER TABLE `push_notification_browsers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `invalidated_tokens`
--
ALTER TABLE `invalidated_tokens`
  MODIFY `id_tk` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `product_img_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `push_notification_browsers`
--
ALTER TABLE `push_notification_browsers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
