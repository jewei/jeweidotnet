---
title: "Database Primary Key: Integer vs UUID vs NanoID"
description: "Integer, UUID, ULID, or NanoID as a primary key? My default: an auto-increment integer for joins plus a UUID or ULID for public URLs, with a comparison table."
pubDate: "2022-08-31T16:00:00.000Z"
updatedDate: "2026-10-14T00:00:00.000+08:00"
tags: ["system-design", "database"]
---

> Update (October 2026): UUIDv7 is now a standard (RFC 9562). Laravel 12 generates it by default, and PostgreSQL 18 has a built-in `uuidv7()` function. It fixes index order but not key size. For most systems with under 1 million users and moderate complexity, I still use an integer as the primary key and a UUID/ULID for external references.

TLDR: Use Both Integer (as PK) and UUID/ULID.

## The Ultimate Database Key Solution

When it comes to database design, one of the most critical decisions is choosing the right primary key (PK) strategy. For years, there’s been an ongoing debate between **natural** and **surrogate keys**, with surrogate keys generally emerging as the superior choice because they are more flexible and disconnected from real-world data. But the debate doesn’t stop there; surrogate keys can take multiple forms, commonly seen as simple **integers** or **UUID/ULID**.

But there's no need to limit yourself to one or the other. Instead, let's leverage the best of both worlds: **use both an integer** (auto-increment) and **a UUID/ULID**.

## Why Choose Both an Integer and UUID/ULID?

| Feature                  | Big Integers        | UUIDv7                               | nanoid             |
| ------------------------ | ------------------- | ------------------------------------ | ------------------ |
| **Example**              | 9223372036854775807 | 019535d9-3df7-79fb-b466-fa907fa17f9e | FYaebyAFTGca       |
| **Data Type**            | BIGINT              | BINARY(16) or `uuid`                 | CHAR(12) ascii_bin |
| **Size**                 | 8 bytes             | 16 bytes                             | 12 bytes           |
| **Sequential**           | Yes                 | Yes (time-ordered)                   | No                 |
| **Max Records**          | 2⁶³ (signed)        | 2⁷⁴ per millisecond                  | 64¹² (about 2⁷²)   |
| **Expose timestamp**     | No                  | Yes                                  | No                 |
| **Expose total records** | Yes                 | No                                   | No                 |
| **Generation at**        | Database            | App, or PostgreSQL 18 `uuidv7()`     | App                |

The example BIGINT is the signed maximum. MySQL also has `BIGINT UNSIGNED` (up to 2⁶⁴), but PostgreSQL has no unsigned types. The nanoid column uses a custom 12-character length; the default is 21 characters. In MySQL, store it as `CHAR(12) CHARACTER SET ascii COLLATE ascii_bin`. The default collation ignores case, so `abc` and `ABC` would collide on a unique index.

### 1\. Integer as the Primary Key

The idea is simple: use an **integer** as your primary key. Here’s why:

- **Compact and performant**: Integers, especially BIGINT, are compact and fast as they are only 8 bytes long. As highly sequential keys, they also optimize database indexing, which is crucial for performance.
- **Human readability**: Numeric IDs are much easier to read, debug, and refer to in queries. You can simply remember or double-click and copy an integer like "1234" instead of deciphering long, complex strings like "70E2E8DE-500E-4630-B3CB-166131D35C21."
- **Suitable for internal joins**: Running joins across multiple tables using integers is incredibly efficient and straightforward.

### 2\. UUID/ULID for External Exposure (e.g., URLs)

In addition to the integer primary key, you should store a **UUID** or **ULID** in a separate column. Here’s why:

- **Avoid exposing internal structure**: Using a UUID/ULID in APIs and URLs hides the underlying database structure. It makes the next record much harder to guess and hides the total count of records.
- **Reduce information leaks**: Competitors cannot read your user count from a URL. A UUID is not access control. Anyone with the link can still request it, so always check that the user may see the record. UUIDv7 and ULID also reveal when a record was created.
- **Uniqueness across systems**: UUIDs and ULIDs are useful in distributed systems, ensuring globally unique identifiers without the need for worrying about synchronization between your databases.

### Composite Design: The Best of Both Worlds

Here’s the proposed structure:

- **Primary key column**: An **auto-incrementing integer** for internal usage and table joins.
- **UUID/ULID column**: Used in URLs, APIs, and external exposure. This column isn’t the primary key but serves as a public identifier of records.

In this way, you achieve both **database optimization** and **external security and flexibility**.

If people will read your IDs, add a type prefix. Stripe-style IDs such as `user_01h455vb4pex5vsknk084sn02q` say what they point to. I wrote [TypeID PHP](/introducing-typeid-php/) for this: it encodes a UUIDv7 with a prefix, so the database can still store a 16-byte UUID.

## Why Not Just UUIDv7?

UUIDv4 is random, so each new key lands somewhere in the middle of the index. InnoDB stores rows in primary key order, so random keys split pages and spread writes across the whole table. UUIDv7 puts a 48-bit timestamp first, so new keys go to the end of the index, as integers do. That fixes the ordering problem.

It does not fix size. A UUID takes 16 bytes, twice a BIGINT, and every foreign key that points to the table pays that cost again. In InnoDB, every secondary index stores the primary key too, so a table with five secondary indexes stores it five more times.

UUIDv7 is the best UUID to use as a primary key. For a single database, the integer is still smaller and easier to read, and the UUID column covers everything the outside world sees.

## When I Use a UUID or ULID as the Primary Key

Most of my Laravel apps use integer primary keys. A few use a UUID or ULID as the primary key instead, because the integer stops working when:

- **The client creates the ID.** Offline-first and mobile apps create records before the server sees them.
- **Records from several databases merge.** Integer keys from two databases collide.
- **You shard.** Each shard can create keys without a central sequence.
- **You need the ID before the insert.** For example, to queue a job or write related records in one go.

In those cases, use UUIDv7 or ULID. Do not use UUIDv4.

## Example Table Structure

```sql title="schema-mysql.sql"
CREATE TABLE example_table (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,  -- Internal Primary Key
  uuid BINARY(16) NOT NULL UNIQUE,       -- External Identifier (UUID/ULID)
  ...
);
```

MySQL has no UUIDv7 function, so generate the value in the app. PostgreSQL 18 can do it in the database:

```sql title="schema-postgres.sql"
CREATE TABLE example_table (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  public_id uuid NOT NULL UNIQUE DEFAULT uuidv7(),
  ...
);
```

In Laravel 12 and later, the `HasUuids` trait generates UUIDv7. `Str::orderedUuid()` creates the older ordered UUIDv4 format, which is only worth keeping for existing tables.

## The Conclusion

With this dual-identifier strategy, you cover all your bases:

1.  **Use an integer** primary key for **internal indexing** and **database performance**.
2.  Add a **UUID/ULID column** for exposing **records via URLs or APIs** without compromising internal structure.

Managed databases such as Amazon RDS and PlanetScale make operations easier, but they do not change how your keys sit in an index. Choose the key type yourself, and this structure balances performance with security, scalability, and flexibility.

**Case closed.**
