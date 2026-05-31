---
title: "Database Primary Key"
description: "Choosing a database primary key between big integers, ordered UUID, and nanoid."
pubDate: "2022-08-31T16:00:00.000Z"
updatedDate: "2024-09-22T16:10:09.000Z"
tags: ["system-design", "database"]
---

> Update (May 2026): For most systems with under 1 million users and moderate complexity, the best approach is still to use an integer as the primary key and a UUID/ULID for external references.

TLDR: Use Both Integer (as PK) and UUID/ULID.

## The Ultimate Database Key Solution

When it comes to database design, one of the most critical decisions is choosing the right primary key (PK) strategy. For years, there’s been an ongoing debate between **natural** and **surrogate keys**, with surrogate keys generally emerging as the superior choice because they are more flexible and disconnected from real-world data. But the debate doesn’t stop there; surrogate keys can take multiple forms, commonly seen as simple **integers** or **UUID/ULID**.

But there's no need to limit yourself to one or the other. Instead, let's leverage the best of both worlds: **use both an integer** (auto-increment) and **a UUID/ULID**.

## Why Choose Both an Integer and UUID/ULID?

| Feature                  | Big Integers         | Ordered UUIDv4                       | nanoid           |
| ------------------------ | -------------------- | ------------------------------------ | ---------------- |
| **Example**              | 18446744073709551615 | 70E2E8DE-500E-4630-B3CB-166131D35C21 | FYaebyAFTGca     |
| **Data Type**            | BIGINT               | BINARY(16)                           | CHAR(12)         |
| **Size**                 | 8 bytes              | 16 bytes                             | 12 bytes         |
| **Sequential**           | Yes                  | Yes                                  | No               |
| **Max Records**          | 2⁶⁴                  | 2¹²²                                 | 64¹² (about 2⁷²) |
| **Expose timestamp**     | No                   | Yes                                  | No               |
| **Expose total records** | Yes                  | No                                   | No               |
| **Generation at**        | Database             | App                                  | App              |

#### 1\. Integer as the Primary Key

The idea is simple: use an **integer** as your primary key. Here’s why:

- **Compact and performant**: Integers, especially BIGINT, are compact and fast as they are only 8 bytes long. As highly sequential keys, they also optimize database indexing, which is crucial for performance.
- **Human readability**: Numeric IDs are much easier to read, debug, and refer to in queries. You can simply remember or double-click and copy an integer like "1234" instead of deciphering long, complex strings like "70E2E8DE-500E-4630-B3CB-166131D35C21."
- **Suitable for internal joins**: Running joins across multiple tables using integers is incredibly efficient and straightforward.

#### 2\. UUID/ULID for External Exposure (e.g., URLs)

In addition to the integer primary key, you should store a **UUID** or **ULID** in a separate column. Here’s why:

- **Avoid exposing internal structure**: Using a UUID/ULID in APIs and URLs hides the underlying database structure. It prevents users from easily guessing the next record or inferring the total count of records.
- **Avoid security risks**: By using UUID/ULID in URLs, you drastically reduce the possibility of people figuring out confidential information (e.g., user counts) or guessing and accessing adjacent records.
- **Uniqueness across systems**: UUIDs and ULIDs are useful in distributed systems, ensuring globally unique identifiers without the need for worrying about synchronization between your databases.

#### Composite Design: The Best of Both Worlds

Here’s the proposed structure:

- **Primary key column**: An **auto-incrementing integer** for internal usage and table joins.
- **UUID/ULID column**: Used in URLs, APIs, and external exposure. This column isn’t the primary key but serves as a public identifier of records.

In this way, you achieve both **database optimization** and **external security and flexibility**.

## Example Table Structure

```sql
CREATE TABLE example_table (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- Internal Primary Key
  uuid BINARY(16) NOT NULL UNIQUE,       -- External Identifier (UUID/ULID)
  ...
);
```

## The Conclusion

With this dual-identifier strategy, you cover all your bases:

1.  **Use an integer** primary key for **internal indexing** and **database performance**.
2.  Add a **UUID/ULID column** for exposing **records via URLs or APIs** without compromising internal structure.

Let the cloud database providers (such as Amazon RDS, PlanetScale, etc.) handle the performance concerns—you’ll have the structure that perfectly balances performance with security, scalability, and flexibility.

**Case closed.**
