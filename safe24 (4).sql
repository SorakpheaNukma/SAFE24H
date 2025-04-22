-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2025 at 05:28 AM
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
-- Database: `safe24`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner_images`
--

CREATE TABLE `banner_images` (
  `banner_images_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner_images`
--

INSERT INTO `banner_images` (`banner_images_id`, `image_path`, `create_at`, `update_at`) VALUES
(1, 'image.png', '2025-04-06 10:32:38', '2025-04-06 11:03:35'),
(2, 'image2.png', '2025-04-06 10:32:38', '2025-04-06 11:03:48'),
(3, 'image3.png', '2025-04-06 10:32:38', '2025-04-06 11:03:58');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `variant_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 2, 35, 1, '2025-04-20 04:00:58', '2025-04-20 04:00:58'),
(2, 2, 2, 1, '2025-04-20 07:02:40', '2025-04-20 07:02:40'),
(3, 2, 39, 1, '2025-04-20 22:26:19', '2025-04-20 22:26:19'),
(4, 2, 36, 1, '2025-04-21 03:22:52', '2025-04-21 03:22:52');

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
(1, 'Trang phục Y tế', '2025-04-19 01:21:06', '2025-04-19 01:21:06'),
(2, 'Trang phục Công nhân', '2025-04-19 01:21:14', '2025-04-19 01:21:14'),
(3, 'Trang phục đầu bếp', '2025-04-19 01:21:28', '2025-04-19 01:21:28');

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
(1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5MDU1ODIsImV4cCI6MTc3NjQ0MTU4MiwibmJmIjoxNzQ0OTA1NTgyLCJqdGkiOiJScmF4bTd0eVlnZGpkMUdKIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Os2xO80lvfxPl1KMf8ZVoKJpEjOkuYh5PH7WnxswJ1E', '2026-04-17 08:59:42', '2025-04-17 09:03:07', '2025-04-17 09:03:07'),
(2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5MDU3OTcsImV4cCI6MTc3NjQ0MTc5NywibmJmIjoxNzQ0OTA1Nzk3LCJqdGkiOiIyV1NNV2JFRFdkN0Q2V1dVIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.DJ7AD5n5t78tpO28YnG5HhUZx-CTR74bDxsKDtR8rkY', '2026-04-17 09:03:17', '2025-04-17 09:03:44', '2025-04-17 09:03:44'),
(3, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5MDU4MjgsImV4cCI6MTc3NjQ0MTgyOCwibmJmIjoxNzQ0OTA1ODI4LCJqdGkiOiJlaWc5MmF0ZnRhRzNwNkRMIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.l3KqnZ32zY7HbTsfeq6gksnn5mg866-dsKdp4KNjc3g', '2026-04-17 09:03:48', '2025-04-18 05:26:27', '2025-04-18 05:26:27'),
(4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5NzkxOTIsImV4cCI6MTc3NjUxNTE5MiwibmJmIjoxNzQ0OTc5MTkyLCJqdGkiOiJKZ0ZWV2hkc2FhbXdLQThZIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.8Zg5Zb8jrECwPA7QPjX3KXb71gOKOKaR9Ds6oddVOA4', '2026-04-18 05:26:32', '2025-04-18 07:09:51', '2025-04-18 07:09:51'),
(5, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5ODUzOTUsImV4cCI6MTc3NjUyMTM5NSwibmJmIjoxNzQ0OTg1Mzk1LCJqdGkiOiJPbE1ZMHhvc3lacDZaaHV4Iiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.cO1aSFx5Wfx4xFfZtuflBTMZ5nWRs1T1SmsMn1P4EW8', '2026-04-18 07:09:55', '2025-04-18 08:36:03', '2025-04-18 08:36:03'),
(6, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5OTA1NjgsImV4cCI6MTc3NjUyNjU2OCwibmJmIjoxNzQ0OTkwNTY4LCJqdGkiOiIwdGtuczVnVW5kSE9vRzh4Iiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.OEdjwgGYK_2_i0YZW_5T0Ok3bIEN_rtrJq4lQGjhjZ4', '2026-04-18 08:36:08', '2025-04-18 09:14:44', '2025-04-18 09:14:44'),
(7, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5OTI4ODksImV4cCI6MTc3NjUyODg4OSwibmJmIjoxNzQ0OTkyODg5LCJqdGkiOiI3aHYzcmlNZkdSTk9CZDdiIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.GJP4x-G4R0tQY2UttYdl_gLewyDjoT4FaDYwWBVzprY', '2026-04-18 09:14:49', '2025-04-18 09:37:10', '2025-04-18 09:37:10'),
(8, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ5OTQyMzcsImV4cCI6MTc3NjUzMDIzNywibmJmIjoxNzQ0OTk0MjM3LCJqdGkiOiJBUHJvNWMwSEVJS3p1bXdsIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.-Lm6hH63GdDD53OAjU93-g_c4PX5uBW-7bok3zJHOls', '2026-04-18 09:37:17', '2025-04-18 09:37:44', '2025-04-18 09:37:44'),
(9, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ3MzIzNTksImV4cCI6MTc3NjI2ODM1OSwibmJmIjoxNzQ0NzMyMzU5LCJqdGkiOiJMT0hIMm1CRmk0OVhwdXBmIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.wLcHDYxtCann_xTD9hakQub8ccPjh05BxHVhNsi_CTQ', '2026-04-15 08:52:39', '2025-04-18 09:56:47', '2025-04-18 09:56:47'),
(10, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDQ3Nzc5MjQsImV4cCI6MTc3NjMxMzkyNCwibmJmIjoxNzQ0Nzc3OTI0LCJqdGkiOiJwMXRVS3B5MFdYM2VkTEtWIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.Rz9zCPaeeS9tewBjEqhx7xkYRT8wyGQ_W1nsZ7hdbAM', '2026-04-15 21:32:04', '2025-04-19 01:20:06', '2025-04-19 01:20:06'),
(11, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUwNTA4MDksImV4cCI6MTc3NjU4NjgwOSwibmJmIjoxNzQ1MDUwODA5LCJqdGkiOiJwTEpWUFNvRUdWbWZtbW03Iiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.cIqnX5WeolOWVsoDDQlKPJG6-Ebr__tyGYN6U7LMVC0', '2026-04-19 01:20:09', '2025-04-19 01:20:14', '2025-04-19 01:20:14'),
(12, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUwNTA4MTgsImV4cCI6MTc3NjU4NjgxOCwibmJmIjoxNzQ1MDUwODE4LCJqdGkiOiJwOEQ0QUtSeGhESXlEUWp4Iiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.MH2QiA56giHIB0UUHs2Td6DrO0-E6VdwBDERq13QBT8', '2026-04-19 01:20:18', '2025-04-19 02:49:27', '2025-04-19 02:49:27'),
(13, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUwNTYxNzcsImV4cCI6MTc3NjU5MjE3NywibmJmIjoxNzQ1MDU2MTc3LCJqdGkiOiJmemluSGhjek9qTDVpUUxiIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.WM7vLc8etsWhCAdN1hMRBc31LxKkEkAZXOPM4-w7eD0', '2026-04-19 02:49:37', '2025-04-19 02:50:22', '2025-04-19 02:50:22'),
(14, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUwNTYyMjksImV4cCI6MTc3NjU5MjIyOSwibmJmIjoxNzQ1MDU2MjI5LCJqdGkiOiJ2d29DRlZTZ1hvRnNMMWFrIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.xBmZi1DYDw58fR2FYyHlvKuUdacbvgEB0Q_vF-UOguI', '2026-04-19 02:50:29', '2025-04-19 02:50:37', '2025-04-19 02:50:37'),
(15, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUwNTYyNjUsImV4cCI6MTc3NjU5MjI2NSwibmJmIjoxNzQ1MDU2MjY1LCJqdGkiOiJNdjlsMnZOS29rZUpZWE9jIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.MwDJuw5nk_NX9Gkh1wDWuoklgxGVWrJuE_lR6LU8SK4', '2026-04-19 02:51:05', '2025-04-19 02:51:20', '2025-04-19 02:51:20'),
(16, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUwNTYyOTYsImV4cCI6MTc3NjU5MjI5NiwibmJmIjoxNzQ1MDU2Mjk2LCJqdGkiOiI3VU1ma2ZuYWt0OUt6S3Q1Iiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.o8BwajfuYSqUssJlyapm9d1IEbxkYfS9DoZELXjj_c4', '2026-04-19 02:51:36', '2025-04-19 04:13:07', '2025-04-19 04:13:07'),
(17, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUwNjIyNDcsImV4cCI6MTc3NjU5ODI0NywibmJmIjoxNzQ1MDYyMjQ3LCJqdGkiOiJ6QTVSazF2elZLcDB5NlVwIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.3dum1AmmubWlHBVSc7RMZ7loid8F-qxsU6dV-cjht6k', '2026-04-19 04:30:47', '2025-04-20 00:46:30', '2025-04-20 00:46:30'),
(18, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUxMzcwOTYsImV4cCI6MTc3NjY3MzA5NiwibmJmIjoxNzQ1MTM3MDk2LCJqdGkiOiIwTVJlcjdJSWsxTURsNUhxIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.5RVaRszDnIpN2HIGVNBWxoRRwssLHG4nRaiKf-yjzdI', '2026-04-20 01:18:16', '2025-04-20 01:18:27', '2025-04-20 01:18:27'),
(19, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUxMzcxMTEsImV4cCI6MTc3NjY3MzExMSwibmJmIjoxNzQ1MTM3MTExLCJqdGkiOiJtd2R0TGJtd2JHaFFmWlFEIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.xWzv7zmvAau2V4wmHw4f4FT0e0ERFb3W8JzYBkdcG0A', '2026-04-20 01:18:31', '2025-04-20 01:26:41', '2025-04-20 01:26:41'),
(20, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUxMzc2MDYsImV4cCI6MTc3NjY3MzYwNiwibmJmIjoxNzQ1MTM3NjA2LCJqdGkiOiJlZk5VYWVSeHNIcmNQR0plIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.WokmuZao9lOCYuPHFn6KuTu1u7P1PnjeoJ6K5i6mDD8', '2026-04-20 01:26:46', '2025-04-20 02:26:02', '2025-04-20 02:26:02'),
(21, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUxNDExNjksImV4cCI6MTc3NjY3NzE2OSwibmJmIjoxNzQ1MTQxMTY5LCJqdGkiOiJ6Z0FqZFJ4ekxVV3R3QVEzIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.2pnHjYqwUA0muOY5ozaXT_x6sPsEVs8GU62qQ63rUfU', '2026-04-20 02:26:09', '2025-04-20 02:43:39', '2025-04-20 02:43:39'),
(22, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUxNDIyMjQsImV4cCI6MTc3NjY3ODIyNCwibmJmIjoxNzQ1MTQyMjI0LCJqdGkiOiJmcFJJNTFiYWtKbkxPdUtGIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.UpHCM51AOMQBCeygVBn_gy4QhdentkBVPl85duoyu1o', '2026-04-20 02:43:44', '2025-04-21 01:41:26', '2025-04-21 01:41:26'),
(23, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUyMjQ4OTEsImV4cCI6MTc3Njc2MDg5MSwibmJmIjoxNzQ1MjI0ODkxLCJqdGkiOiIzOXdYRUhhdFR1ZXJJbmgwIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.SdbWnF2Wy486cDnugZftd1W14CoWFdd_kx78Lyw9D7E', '2026-04-21 01:41:31', '2025-04-21 03:24:06', '2025-04-21 03:24:06'),
(24, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUyMzEwNTEsImV4cCI6MTc3Njc2NzA1MSwibmJmIjoxNzQ1MjMxMDUxLCJqdGkiOiJqNVg5dFdtcllIMlM2SDFXIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.2wb0_Akz7DLBFd-_eh_0sNrURuW1tApb7MNwN7TtA1Y', '2026-04-21 03:24:11', '2025-04-21 03:24:51', '2025-04-21 03:24:51'),
(25, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvbG9naW4iLCJpYXQiOjE3NDUyMzEwOTYsImV4cCI6MTc3Njc2NzA5NiwibmJmIjoxNzQ1MjMxMDk2LCJqdGkiOiJ0clZweEw4dWJScFhPd2tkIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.yWog5coo1AoUn92YtTYVdP-Fm69VObNm4KosjG9rImY', '2026-04-21 03:24:56', '2025-04-21 03:26:30', '2025-04-21 03:26:30');

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
(23, '2014_10_12_000000_create_users_table', 1),
(24, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(25, '2024_09_09_142158_invalided_token', 1),
(26, '2024_09_09_150605_category', 1),
(27, '2024_09_10_072541_create_products_table', 1),
(54, '2024_09_10_080820_create_orders_table', 2),
(55, '2024_09_10_095047_payment', 2),
(56, '2024_09_16_142642_create_product_images_table', 2),
(57, '2024_10_16_155707_add_otp_to_users_table', 2),
(58, '2024_10_18_075303_create_carts_table', 2),
(59, '2024_10_18_081038_add_columns_to_users_table', 2),
(60, '2024_10_26_103849_create_order_items_table', 2),
(61, '2024_10_27_045112_create_push_notification_browsers_table', 2),
(62, '2025_04_17_144100_create_product_variants_table', 3),
(65, '2025_04_18_161115_add_variant_id_to_order_items', 5),
(66, '2025_04_18_155423_add_variant_id_to_order_items_table', 6),
(67, '2025_04_19_163328_add_variant_id_to_carts_table', 7);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `total_amount` double(8,2) NOT NULL,
  `status` varchar(255) NOT NULL,
  `order_date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `order_date`, `created_at`, `updated_at`) VALUES
(22, 2, 16.00, 'processing', '2025-04-21 12:26:27', '2025-04-20 22:26:28', '2025-04-20 22:26:28'),
(23, 2, 16.00, 'processing', '2025-04-21 13:32:43', '2025-04-20 23:32:43', '2025-04-20 23:32:43'),
(24, 2, 16.00, 'processing', '2025-04-21 13:37:22', '2025-04-20 23:37:22', '2025-04-20 23:37:22'),
(25, 2, 32.00, 'processing', '2025-04-21 13:44:05', '2025-04-20 23:44:05', '2025-04-20 23:44:05'),
(26, 2, 32.00, 'processing', '2025-04-21 13:44:20', '2025-04-20 23:44:20', '2025-04-20 23:44:20'),
(27, 2, 16.00, 'processing', '2025-04-21 14:00:08', '2025-04-21 00:00:08', '2025-04-21 00:00:08'),
(28, 2, 16.00, 'processing', '2025-04-21 14:09:39', '2025-04-21 00:09:40', '2025-04-21 00:09:40'),
(29, 2, 16.00, 'processing', '2025-04-21 14:42:54', '2025-04-21 00:42:54', '2025-04-21 00:42:54'),
(30, 2, 16.00, 'processing', '2025-04-21 14:47:32', '2025-04-21 00:47:32', '2025-04-21 00:47:32'),
(31, 2, 16.00, 'processing', '2025-04-21 15:01:27', '2025-04-21 01:01:27', '2025-04-21 01:01:27'),
(32, 2, 16.00, 'processing', '2025-04-21 15:36:30', '2025-04-21 01:36:30', '2025-04-21 01:36:30'),
(33, 2, 16.00, 'processing', '2025-04-21 15:41:43', '2025-04-21 01:41:43', '2025-04-21 01:41:43'),
(34, 2, 16.00, 'processing', '2025-04-21 15:42:29', '2025-04-21 01:42:29', '2025-04-21 01:42:29'),
(35, 2, 16.00, 'processing', '2025-04-21 15:44:03', '2025-04-21 01:44:03', '2025-04-21 01:44:03'),
(36, 2, 16.00, 'processing', '2025-04-21 15:46:27', '2025-04-21 01:46:27', '2025-04-21 01:46:27'),
(37, 2, 16.00, 'processing', '2025-04-21 15:51:43', '2025-04-21 01:51:43', '2025-04-21 01:51:43'),
(38, 2, 16.00, 'processing', '2025-04-21 15:54:20', '2025-04-21 01:54:20', '2025-04-21 01:54:20'),
(39, 2, 16.00, 'processing', '2025-04-21 15:54:45', '2025-04-21 01:54:46', '2025-04-21 01:54:46'),
(40, 2, 16.00, 'processing', '2025-04-21 17:22:58', '2025-04-21 03:22:59', '2025-04-21 03:22:59'),
(41, 2, 16.00, 'processing', '2025-04-21 17:27:26', '2025-04-21 03:27:26', '2025-04-21 03:27:26'),
(42, 2, 32.00, 'processing', '2025-04-21 17:27:47', '2025-04-21 03:27:47', '2025-04-21 03:27:47');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `variant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` double(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`item_id`, `order_id`, `variant_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 40, 36, 1, 16.00, '2025-04-21 03:22:59', '2025-04-21 03:22:59'),
(2, 41, 35, 1, 16.00, '2025-04-21 03:27:27', '2025-04-21 03:27:27'),
(3, 42, 35, 2, 16.00, '2025-04-21 03:27:47', '2025-04-21 03:27:47');

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

INSERT INTO `products` (`product_id`, `product_name`, `product_price`, `des_1`, `des_2`, `des_3`, `des_4`, `des_5`, `des_6`, `des_7`, `des_8`, `des_9`, `des_10`, `des_11`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Áo y tá xanh trắng', 20.00, 'Áo y tá xanh trắng 1', 'Áo y tá xanh trắng 2', 'Áo y tá xanh trắng 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-04-19 01:57:11', '2025-04-19 02:49:58'),
(2, 'Bộ quần áo ý tá hồng gợi cảm', 21.00, 'Bộ quần áo ý tá hồng gợi cảm 1', 'Bộ quần áo ý tá hồng gợi cảm 2', 'Bộ quần áo ý tá hồng gợi cảm 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(3, 'Bộ điều dưỡng xanh xám', 23.00, 'Bộ điều dưỡng xanh xám 1', 'Bộ điều dưỡng xanh xám 2', 'Bộ điều dưỡng xanh xám 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(4, 'Bộ đồ y tá đen xanh', 24.00, 'Bộ đồ y tá đen xanh 1', 'Bộ đồ y tá đen xanh 2', 'Bộ đồ y tá đen xanh 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(5, 'Bộ đồ đầu bếp liền tạp dề', 15.00, 'Bộ đồ đầu bếp liền tạp dề 1', 'Bộ đồ đầu bếp liền tạp dề 2', 'Bộ đồ đầu bếp liền tạp dề 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(6, 'Bộ áo liền tạp dề nữ', 18.00, 'Bộ áo liền tạp dề nữ 1', 'Bộ áo liền tạp dề nữ 2', 'Bộ áo liền tạp dề nữ 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, '2025-04-19 02:58:53', '2025-04-19 02:58:53'),
(7, 'Set đồ đầu bếp đen nam nữ', 17.00, 'Set đồ đầu bếp đen nam nữ 1', 'Set đồ đầu bếp đen nam nữ 2', 'Set đồ đầu bếp đen nam nữ 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, '2025-04-19 02:59:50', '2025-04-19 09:04:13'),
(8, 'Set phục vụ xám nam', 16.00, 'Set phục vụ xám nam 1', 'Set phục vụ xám nam 2', 'Set phục vụ xám nam 3', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, '2025-04-19 03:00:33', '2025-04-19 09:03:56');

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
(1, 1, 'c34da887-00f2-47cb-9c68-19f45bc63778.jpg', '2025-04-19 01:57:12', '2025-04-19 01:57:12'),
(2, 1, '5e16c2b8-5186-42f2-8a38-5f83c419a753.jpg', '2025-04-19 01:57:12', '2025-04-19 01:57:12'),
(3, 1, '932654f8-1219-4eef-9e5a-42bed06c0244.jpg', '2025-04-19 01:57:12', '2025-04-19 01:57:12'),
(4, 2, '15c5c140-10e2-4a4c-b67c-0ec1ebc32d85.jpg', '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(5, 2, '94ebe84c-9504-4b08-943d-070b218744fc.jpg', '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(6, 2, '4112611a-bfda-498c-a4f4-62027d72f419.jpg', '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(7, 3, '33d67c87-071f-4afc-a34c-b9940e5b9b4b.jpg', '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(8, 3, '371903ff-bfd1-4d30-b705-b780b6aa7071.jpg', '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(9, 3, '3dd2b9ce-4ec2-4d80-bdc8-92781143fe33.jpg', '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(10, 4, 'e51347c7-1b6a-4e4d-ac88-7975a3914601.jpg', '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(11, 4, 'ecaf7bc7-2872-42bf-8f5c-f9fc6745a34c.jpg', '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(12, 4, '06b4aeee-3882-4d3e-bd1d-5f3d1abd5e97.jpg', '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(13, 5, '0a1e22a1-676d-4099-b0cc-9c3ede5864a6.jpg', '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(14, 5, '64fee354-8256-4ef9-94c5-beb4dc21a863.jpg', '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(15, 5, '492c8eb1-83fb-47d9-a3ac-7a37577c628f.jpg', '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(16, 6, '79a61c6c-5203-4dcf-87ec-0b1aa7862d7f.jpg', '2025-04-19 02:58:54', '2025-04-19 02:58:54'),
(17, 6, 'c46c8246-c91f-4913-989a-80ece5553504.jpg', '2025-04-19 02:58:54', '2025-04-19 02:58:54'),
(18, 6, 'dc6d1957-2c16-41d5-979f-beee83beb3a2.jpg', '2025-04-19 02:58:54', '2025-04-19 02:58:54'),
(19, 7, 'd179bf45-f399-47ac-a748-d9f0bf5e4bf7.jpg', '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(20, 7, 'b974e927-227e-47b5-89c3-99e8884310a1.jpg', '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(21, 7, '8284cf74-72d7-4f1a-abb4-35d4fbe0d8bc.jpg', '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(22, 7, 'b184c46f-81e5-43d0-85e3-77a9f6a88a7a.jpg', '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(23, 8, 'd03b0076-9603-4b45-895f-ca536952e53c.jpg', '2025-04-19 03:00:33', '2025-04-19 03:00:33'),
(24, 8, '2906a105-2ed7-41b4-8749-ee4713785432.jpg', '2025-04-19 03:00:33', '2025-04-19 03:00:33'),
(25, 8, 'f7d34346-7d1c-4268-95b5-c2bee30b12b1.jpg', '2025-04-19 03:00:33', '2025-04-19 03:00:33');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `size` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `sold` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `size`, `quantity`, `sold`, `created_at`, `updated_at`) VALUES
(1, 1, 'S', 2, 0, '2025-04-19 01:57:11', '2025-04-19 02:49:58'),
(2, 1, 'M', 2, 0, '2025-04-19 01:57:11', '2025-04-19 02:49:58'),
(3, 1, 'L', 2, 0, '2025-04-19 01:57:11', '2025-04-19 02:49:58'),
(4, 1, 'XL', 2, 0, '2025-04-19 01:57:11', '2025-04-19 02:49:58'),
(5, 1, '2XL', 2, 0, '2025-04-19 01:57:11', '2025-04-19 02:49:58'),
(6, 2, 'S', 3, 0, '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(7, 2, 'M', 3, 0, '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(8, 2, 'L', 3, 0, '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(9, 2, 'XL', 3, 0, '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(10, 2, '2XL', 3, 0, '2025-04-19 02:52:41', '2025-04-19 02:52:41'),
(11, 3, 'S', 3, 0, '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(12, 3, 'M', 3, 0, '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(13, 3, 'L', 3, 0, '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(14, 3, 'XL', 3, 0, '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(15, 3, '2XL', 3, 0, '2025-04-19 02:53:32', '2025-04-19 02:53:32'),
(16, 4, 'S', 2, 0, '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(17, 4, 'M', 2, 0, '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(18, 4, 'L', 2, 0, '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(19, 4, 'XL', 3, 0, '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(20, 4, '2XL', 2, 0, '2025-04-19 02:54:15', '2025-04-19 02:54:15'),
(21, 5, 'S', 2, 0, '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(22, 5, 'M', 2, 0, '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(23, 5, 'L', 2, 0, '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(24, 5, '2XL', 2, 0, '2025-04-19 02:57:44', '2025-04-19 02:57:44'),
(25, 6, 'S', 2, 0, '2025-04-19 02:58:53', '2025-04-19 02:58:53'),
(26, 6, 'M', 2, 0, '2025-04-19 02:58:53', '2025-04-19 02:58:53'),
(27, 6, 'L', 3, 0, '2025-04-19 02:58:53', '2025-04-19 02:58:53'),
(28, 6, 'XL', 3, 0, '2025-04-19 02:58:53', '2025-04-19 02:58:53'),
(29, 6, '2XL', 2, 0, '2025-04-19 02:58:53', '2025-04-19 02:58:53'),
(30, 7, 'S', 5, 0, '2025-04-19 02:59:50', '2025-04-19 09:04:13'),
(31, 7, 'M', 3, 0, '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(32, 7, 'L', 20, 0, '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(33, 7, 'XL', 3, 0, '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(34, 7, '2XL', 2, 0, '2025-04-19 02:59:50', '2025-04-19 02:59:50'),
(35, 8, 'S', 8, 3, '2025-04-19 03:00:33', '2025-04-21 03:27:47'),
(36, 8, 'M', 9, 1, '2025-04-19 03:00:33', '2025-04-21 03:22:59'),
(37, 8, 'L', 10, 0, '2025-04-19 03:00:33', '2025-04-19 03:00:33'),
(38, 8, 'XL', 5, 0, '2025-04-19 03:00:33', '2025-04-19 03:00:33'),
(39, 8, '2XL', 5, 0, '2025-04-19 03:00:33', '2025-04-19 03:00:33');

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
(1, 'admin', 'admin@gmail.com', '$2y$10$maznh/Ay2DVOmlWHUG/8ku1Snjat3qIHmVMvyVaAuGy0v0.XZhPuW', '093483', NULL, 'admin', NULL, NULL, '2024-09-14 07:17:41', '2024-09-14 07:17:41', NULL, NULL, NULL),
(2, 'veng ann', 'kunvengann@gmail.com', '$2y$10$9Ui7Bo8aGVgzR1ssHiA.muCJAxTUEUi5mQay6cKDsO/b1QtuY5JD2', '087498674', NULL, 'user', NULL, NULL, '2024-09-14 07:15:02', '2025-04-18 06:53:30', 'កែងផ្លូវ២០៨, ផ្លូវលេខ ១១៤', 'ស្វាយរៀង', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banner_images`
--
ALTER TABLE `banner_images`
  ADD PRIMARY KEY (`banner_images_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_variant` (`user_id`,`variant_id`),
  ADD KEY `variant_id` (`variant_id`);

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
  ADD KEY `order_id` (`order_id`),
  ADD KEY `variant_id` (`variant_id`);

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
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_variants_product_id_foreign` (`product_id`);

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
-- AUTO_INCREMENT for table `banner_images`
--
ALTER TABLE `banner_images`
  MODIFY `banner_images_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invalidated_tokens`
--
ALTER TABLE `invalidated_tokens`
  MODIFY `id_tk` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `product_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `product_img_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `push_notification_browsers`
--
ALTER TABLE `push_notification_browsers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

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

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
