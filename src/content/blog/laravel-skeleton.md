---
title: "Laravel Skeleton"
description: "The Laravel Skeleton offers a rapid and efficient way to start a new project by scaffolding a Laravel app with minimal setup."
pubDate: "2023-08-12T16:00:00.000Z"
updatedDate: "2024-09-22T16:30:30.000Z"
tags: ["open-source"]
---

![](/content/images/2024/09/laravel-skeleton-1.png)

My version of Laravel Skeleton is live on GitHub

Starting a new Laravel project often involves repetitive tasks, such as configuring basic settings, integrating essential tools, and laying down the initial structure. The Laravel Skeleton project comes as a refreshing solution to this problem, allowing developers to scaffold an PHP/Laravel app with ease.

### What Is Laravel Skeleton?

Laravel Skeleton is a project template that combines the latest technologies and best practices to provide a solid starting point for new Laravel projects. Created with a focus on quality and efficiency, it simplifies the setup process and includes valuable integrations that every modern Laravel application may need.

### Get Started in Seconds

You can scaffold your Laravel app via Composer with the following command:

```shell
composer create-project jewei/laravel-skeleton
```

### What's Included?

Laravel Skeleton comes with a host of features and tools:

1.  **Github Action Workflow**: Automatically run tests, static analysis, and code formatting fixes.
2.  **Configured Eloquent Strictness**: Ensure strict adherence to Eloquent best practices.
3.  **Pest**: Leverage architecture testing for better code quality.
4.  **Test Enhancements**: Use LazilyRefreshDatabase instead of RefreshDatabase for optimized testing.
5.  **HTTP Client Enhancements**: Prevent stray requests and enhance security.
6.  **Pint**: Styling with Laravel preset for beautiful code formatting.
7.  **Rector**: Utilize Laravel upgrade rules set to simplify future upgrades.
8.  **Middleware Enhancements**: Utilize ResponseWithJson for APIs for streamlined JSON responses.
9.  **Simplified Setup**: Removal of Sail, as Docker may be overcomplicated for some projects.

Want more? Here's to the Github repository:

[![GitHub - jewei/laravel-skeleton at jewei.net](/content/images/thumbnail/laravel-skeleton.png "Opinionated Laravel skeleton to scaffold new project configured with best practices.")](https://github.com/jewei/laravel-skeleton?ref=jewei.net)
