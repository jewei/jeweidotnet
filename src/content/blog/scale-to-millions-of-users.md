---
title: "Scale to Millions of Users"
description: "How to design a system that supports millions of users? What are the challenges to scaling it up to serve millions of users?"
pubDate: "2022-11-10T16:00:00.000Z"
updatedDate: "2024-09-22T16:25:01.000Z"
tags: ["system-design", "infrastructure"]
---

### Designing a Scalable System to Support Millions of Users

So, you're wondering how to design a system that can scale to support millions of users? What challenges will you face when scaling up, and what are the latest technologies available? Let's explore.

#### The Single Server Setup: Where It All Begins

Typically, new projects start with a **single server setup**, where the web server hosts everything: source code, static assets like media files, and the database—everything running on one instance.

While this might be fine for a **small number of users**, as traffic grows, several constraints and single points of failure emerge:

*   If the server goes down, the entire system goes down. You lose all functionality.
*   Limited scaling: CPU, memory, disk I/O, and bandwidth limitations make it impossible to handle large traffic.
*   Slow response times: As data grows, querying a single database becomes slower.

Now that we've seen the limitations, let's talk about how to break down this monolithic setup to scale it horizontally and improve reliability.

### Let’s Build a Scalable Architecture

Here’s what a modern, scalable architecture could look like:

#### Key Components for Scaling:

1.  **Stateless Web Tier**:  
    Your web layer must be **stateless** so it can scale horizontally without any session affinity (i.e., "sticky sessions"). Simply put, your web servers won’t store user sessions or files directly on them.
    *   **User Sessions**: Move session management to a shared storage system, such as **Redis** or a dedicated session database. This enables instant scaling by adding more stateless servers behind a load balancer.
    *   **User Files**: Store uploaded user files (images, videos, documents) in a **shared storage** solution such as **S3-compatible storage** (e.g., DigitalOcean Spaces) or other object storage services.
2.  **Load Balancer**:  
    Add a **load balancer** to distribute incoming traffic evenly to a pool of stateless web servers. This ensures that you can add or remove web servers without downtime.
    *   Software like **HAProxy** or **Nginx** can handle this efficiently.
3.  **Database Replication with Master-Slave Setup**:  
    In this model:Modern databases support **read replicas**: if you're using MySQL or PostgreSQL, you can leverage replication features to offload reads to replicas.
    *   The **Master database** handles all **write operations**.
    *   Multiple **Slave databases** are used for **read operations**, offloading the reading queries from the Master and balancing the load, making your application more scalable for read-heavy tasks.
4.  **NoSQL Solutions for Caching & Non-Relational Storage**:  
    When dealing with data-intensive operations, caching is essential for performance.
    *   Use solutions like **Redis** or **Memcached** to cache frequently accessed data (e.g., session data, API responses, or product details).
    *   Use a **NoSQL database** (e.g., **MongoDB**, **Cassandra**) to store unstructured data or implement features like user messages or logs that don’t need a strict relational schema.
5.  **Leveraging CDN for Static Content**:  
    Use a **Content Delivery Network (CDN)** to serve static files (CSS, JS, images, videos, etc.) from edge servers located closest to your users. This drastically reduces latency and server load.
    *   Solutions like **Cloudflare**, **Fastly**, or **DigitalOcean's CDN** can cache and serve your static content, improving performance.
6.  **Asynchronous Tasks with Message Queues**:  
    Offload heavy, time-consuming tasks (such as video encoding or image processing) to **background services** using message queues like **RabbitMQ**, **Apache Kafka**, or **AWS SQS** (though we’ll focus more on non-AWS alternatives).
    *   This allows your web servers to return a response to users quickly while handling processing tasks asynchronously in the background.
7.  **Centralized Logging & Monitoring**:  
    Send **logs and metrics** to specialized systems that can aggregate and allow you to easily monitor your system health and performance:
    *   **Log Management**: Use centralized logging tools such as **ELK Stack** (ElasticSearch, Logstash, and Kibana), **Fluentd**, or **Loki** to aggregate logs from all servers for a single pane of glass.
    *   **System Metrics**: Tools like **Prometheus** and **Grafana** can gather and visualize server metrics (CPU load, memory usage, disk I/O, etc.).
    *   **Business Metrics**: Use tools that track business-specific KPIs like **user growth**, **revenue**, and others. Open-source event tracking platforms such as **PostHog** might be preferred for fine-tuned analytics based on business metrics.

### Not Enough Power? Enter the API Gateway

Another powerful tool in large architectures is an **API Gateway**, which acts as a **central entry point** to route specific API requests to proper microservices.

API Gateways like **Kong**, **Tyk**, or **Nginx+** reside in front of your system and offer great flexibility with features such as routing, rate-limiting, authentication, and even load balancing.

### Why I Don’t Use AWS: The Cost Factor

Many people instantly think of **AWS** when building scalable systems, but having seen its cost skyrocket as traffic grows, I no longer advocate relying on AWS for startups or small businesses—**especially if you have less than 100,000 users**.

Here’s an alternative that I've found works just as well if not better: **DigitalOcean**.

*   **Affordable Pricing for Early Growth**: For businesses starting out with 0 users or just a few thousand, a **$5/month Droplet** on DigitalOcean is more than enough. As you scale, a **$20/month Droplet** can support substantial traffic (tens of thousands of users) without breaking the bank.
*   **Easy Horizontal Scaling**: With **block storage**, **object storage**, **CDN**, and **load balancers**, DigitalOcean provides everything you need to build a scalable architecture—without the excessive cost overhead we often see with AWS, GCP, or Azure.
*   **Simple Management**: DigitalOcean offers an easy-to-use interface, predictable pricing, straightforward deployments, and even 1-Click Apps for quick scalability. Plus, **spaces** provide the same benefits of S3-compatible object storage for a fraction of the AWS pricing.

#### Economics Matter

For projects and businesses still finding their footing, **forget the expensive cloud** service providers. A **$5 DigitalOcean droplet** is ridiculously cheap and efficient enough for most startups. If you’re lucky enough to grow, you might scale that to a **$20 setup** which could easily handle **<100k users**.

So, why pay more than you have to?

### Closing Thoughts

*   **Start small** with a single Droplet and scale as needed.
*   Keep your web tier stateless for easy horizontal scaling.
*   Use smart caching, CDN, and background processing through message queues.
*   **Master/Slave database setups** can help you efficiently manage reads and writes on large datasets.

If you need more than this, upgrade your hardware gradually on **DigitalOcean** before considering expensive cloud providers. In most cases, **you won’t need AWS**—a **DigitalOcean Droplet** can serve you well beyond your growth expectations.

**Focus on smart architecture** and let the economics work to your advantage!

* * *

**Update**: FFS, [Hetzner](https://hetzner.cloud/?ref=wlxKwWbpL21C) is half the price of DO and now it support Singapore region.
