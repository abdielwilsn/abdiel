---
id: 6e012b28-278e-48ce-8194-b90ad399d904
title: Scaling Laravel to 100K Requests Per Second: A Complete Performance Guide
date: Sat Jan 10 2026
duration: 5 min
categories: laravel
---

*Everything you need to know about building and optimizing Laravel applications for massive scale—from database fundamentals to production replication setups.*

---

When you're building a Laravel application that needs to handle 10 million users and 100,000 requests per second, you're playing a completely different game. The patterns that work for a typical app will crumble under that load. This guide covers everything I've learned about making Laravel perform at scale—from understanding what an index actually is, to setting up database replication, to writing queries that won't bring your servers to their knees.

---

## Table of Contents

1. [The Database is Usually the Bottleneck](#the-database-is-usually-the-bottleneck)
2. [Understanding Indexes from First Principles](#understanding-indexes-from-first-principles)
3. [Query Optimization That Actually Matters](#query-optimization-that-actually-matters)
4. [Database Replication Setup](#database-replication-setup)
5. [Writing Queries That Work with Replication](#writing-queries-that-work-with-replication)
6. [Caching at Every Layer](#caching-at-every-layer)
7. [Horizontal Scaling Patterns](#horizontal-scaling-patterns)
8. [PHP and Laravel Specific Optimizations](#php-and-laravel-specific-optimizations)
9. [Architecture Decisions for Scale](#architecture-decisions-for-scale)
10. [Monitoring and Profiling](#monitoring-and-profiling)

---

## The Database is Usually the Bottleneck

Before diving into optimizations, understand this: at scale, your database is almost always the first thing to fail. A single MySQL or PostgreSQL server can handle maybe 5-10K queries per second under ideal conditions. At 100K requests per second, if each request needs even 2-3 database queries, you're asking for 200-300K queries per second. One server simply cannot do that.

The solutions involve multiple strategies working together:

- **Query optimization** to reduce the work each query does
- **Indexing** to make individual queries faster
- **Caching** to avoid hitting the database at all
- **Replication** to distribute read load across multiple servers
- **Connection pooling** to manage database connections efficiently

Let's start from the fundamentals.

---

## Understanding Indexes from First Principles

### What Happens Without an Index

Imagine a `users` table with 10 million rows. You run:

```sql
SELECT * FROM users WHERE email = 'abdiel@example.com';
```

Without an index, the database performs a **full table scan**. It literally reads every single row, checks if the email matches, and returns the ones that do.

```
Row 1:         email = 'alice@test.com'       → No match, skip
Row 2:         email = 'bob@test.com'         → No match, skip
Row 3:         email = 'carol@test.com'       → No match, skip
...
Row 4,847,293: email = 'abdiel@example.com'   → Match! Return this
...
Row 10,000,000: email = 'zara@test.com'       → No match, skip
```

That's 10 million comparisons to find one row. Even at microseconds per row, this takes seconds.

### What an Index Actually Is

An index is a separate data structure that maps values to their row locations. Think of it like the index at the back of a textbook—instead of reading every page to find "photosynthesis," you look in the index, find "photosynthesis: page 247," and go directly there.

The most common index type is a **B-tree** (balanced tree):

```
                        [M]
                       /   \
                    [E]     [S]
                   /   \   /   \
                 [A-D] [F-L] [N-R] [T-Z]
                  ↓      ↓     ↓     ↓
               (pointers to actual rows)
```

When you search for `email = 'abdiel@example.com'`:

1. Start at root: 'A' < 'M', go left
2. Next level: 'A' < 'E', go left
3. Leaf level: Find 'abdiel@example.com' in the A-D bucket
4. Follow pointer directly to that row

Instead of 10 million comparisons, you did about 3-4. This is **O(log n)** vs **O(n)**.

### The Performance Difference

```
Without index (full scan):
┌─────────────────────────────────────────────────────────┐
│ Scan every row: 10,000,000 operations                   │
│ Time: ~5 seconds                                        │
└─────────────────────────────────────────────────────────┘

With index (B-tree lookup):
┌─────┐
│ 3-4 tree traversals + 1 row fetch                       │
│ Time: ~0.001 seconds                                    │
└─────┘
```

### Creating Indexes in Laravel

```php
// In a migration
Schema::table('users', function (Blueprint $table) {
    $table->index('email');
});
```

```sql
-- Raw SQL equivalent
CREATE INDEX idx_users_email ON users(email);
```

### What the Index Contains

An index on `email` stores:

```
┌─────────────────────────────┬─────────────┐
│ email value                 │ row pointer │
├─────────────────────────────┼─────────────┤
│ 'aaliyah@test.com'          │ → Row 8472  │
│ 'aaron@test.com'            │ → Row 2841  │
│ 'abdiel@example.com'        │ → Row 4847293│
│ 'abigail@test.com'          │ → Row 912   │
└─────────────────────────────┴─────────────┘
```

The index is sorted by email, so binary search works. The row pointer tells the database exactly where to find the full row on disk.

### The Index Tradeoff

Indexes aren't free:

**Storage cost:** The index takes disk space. A table with 5 indexes might have indexes larger than the actual data.

**Write cost:** Every INSERT, UPDATE (on indexed columns), or DELETE must update the index too.

```
Without index:
INSERT → Write 1 row to table
Time: 1 unit

With 5 indexes:
INSERT → Write 1 row to table
      → Update index 1
      → Update index 2
      → Update index 3
      → Update index 4
      → Update index 5
Time: 6 units
```

This is why you don't index everything—you index columns you actually query frequently.

### Composite Indexes

When you query multiple columns together:

```sql
SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';
```

A composite index stores combinations:

```php
$table->index(['user_id', 'status']);
```

**The column order matters enormously.** Composite indexes work left-to-right. You can skip columns from the right, but not from the left.

```php
// This index on ['user_id', 'status', 'created_at']
$table->index(['user_id', 'status', 'created_at']);
```

```sql
-- CAN efficiently serve:
WHERE user_id = 123
WHERE user_id = 123 AND status = 'pending'
WHERE user_id = 123 AND status = 'pending' AND created_at > '2025-01-01'

-- CANNOT efficiently serve:
WHERE status = 'pending'                    -- First column not used
WHERE created_at > '2025-01-01'             -- First column not used
```

Think of it like a phone book sorted by last name, then first name. You can find all "Smiths" easily. You can find "John Smith" easily. But finding all "Johns" regardless of last name requires scanning everything.

### Covering Indexes

A covering index contains all columns needed for a query. The database never touches the actual table—everything comes from the index.

```sql
-- Query only needs these columns
SELECT id, status, amount FROM orders WHERE user_id = 123;
```

```php
// Covering index for this query
$table->index(['user_id', 'status', 'amount', 'id']);
// The entire query is served from the index alone
```

### When Indexes Help

```sql
-- WHERE clause filtering
SELECT * FROM orders WHERE user_id = 123;

-- JOIN conditions  
SELECT * FROM orders JOIN users ON orders.user_id = users.id;

-- ORDER BY (if matching index order)
SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC;

-- Uniqueness enforcement
ALTER TABLE users ADD UNIQUE INDEX (email);
```

### When Indexes Don't Help

```sql
-- Low selectivity (column has few unique values)
SELECT * FROM users WHERE is_active = 1;
-- If 90% of users are active, index barely helps

-- Functions on columns
SELECT * FROM users WHERE LOWER(email) = 'test@test.com';
-- Index on email is useless here

-- Leading wildcards
SELECT * FROM users WHERE email LIKE '%@gmail.com';
-- Can't use index

-- Small tables
-- If table has 100 rows, full scan is faster than index lookup
```

---

## Query Optimization That Actually Matters

### Understanding EXPLAIN ANALYZE

Before optimizing anything, you need to see what's actually happening:

```sql
-- Basic explain
EXPLAIN SELECT * FROM orders WHERE user_id = 123;

-- With actual execution stats (MySQL 8+)
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- PostgreSQL (more detailed)
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT * FROM orders WHERE user_id = 123;
```

The `type` column is crucial. From best to worst:

| Type | Meaning |
|------|---------|
| `system/const` | Single row, basically instant |
| `eq_ref` | One row per join, using unique index |
| `ref` | Multiple rows using index |
| `range` | Index range scan (BETWEEN, <, >, IN) |
| `index` | Full index scan (better than table but still bad) |
| `ALL` | Full table scan—almost always needs fixing |

**Bad output example:**
```
| type | key  | rows   | Extra       |
|------|------|--------|-------------|
| ALL  | NULL | 850000 | Using where |
```

Full table scan, examining 850K rows. Terrible.

**Good output example:**
```
| type | key     | rows | Extra       |
|------|---------|------|-------------|
| ref  | user_id | 23   | Using where |
```

Using index, only scanning 23 rows. Much better.

### The N+1 Problem

This is the most common performance killer in Laravel applications:

```php
// Bad: N+1 problem
$orders = Order::all();

foreach ($orders as $order) {
    echo $order->customer->name; // Each iteration hits the database
}
```

This executes 101 queries for 100 orders—one for all orders, then one per order to fetch each customer. At 100K requests per second, you're looking at potentially millions of unnecessary database round trips.

```php
// Good: Eager loading
$orders = Order::with('customer')->get();

foreach ($orders as $order) {
    echo $order->customer->name; // Already loaded, no query
}
```

Now it's just 2 queries total: one for orders, one for all related customers.

For nested relationships:

```php
// Load orders → customers → their addresses → country
$orders = Order::with('customer.address.country')->get();

// Multiple relationships at same level
$orders = Order::with(['customer', 'items', 'payment'])->get();

// Constrained eager loading
$orders = Order::with(['items' => function ($query) {
    $query->where('status', 'active')->select('id', 'order_id', 'name');
}])->get();
```

### The SELECT * Problem

```php
// Bad: Fetches all columns even if you need two
$orders = Order::where('user_id', $userId)->get();
foreach ($orders as $order) {
    echo $order->id . ': ' . $order->status;
}

// Good: Only fetch what you need
$orders = Order::where('user_id', $userId)
    ->select(['id', 'status'])
    ->get();
```

This matters more than people think. Wide tables with TEXT/BLOB columns are especially affected. Selecting specific columns also enables covering indexes.

### Pagination Done Wrong

```php
// Bad: OFFSET scans and discards rows
Order::offset(100000)->limit(20)->get();
// Database reads 100,020 rows, throws away 100,000
```

At page 5000 with 20 per page, you're scanning 100K rows for 20 results.

```php
// Good: Cursor-based pagination
// First page
$orders = Order::where('user_id', $userId)
    ->orderBy('id', 'desc')
    ->limit(20)
    ->get();

// Next page - use the last ID from previous page
$lastId = $orders->last()->id;
$orders = Order::where('user_id', $userId)
    ->where('id', '<', $lastId)
    ->orderBy('id', 'desc')
    ->limit(20)
    ->get();
```

The difference at scale:

```sql
-- OFFSET: Always slow at high offsets
SELECT * FROM orders WHERE user_id = 123 
ORDER BY id DESC LIMIT 20 OFFSET 100000;
-- Execution time: 850ms (scans 100K rows)

-- Cursor: Consistent speed regardless of position
SELECT * FROM orders WHERE user_id = 123 AND id < 500000 
ORDER BY id DESC LIMIT 20;
-- Execution time: 2ms (index seek + 20 rows)
```

Implement cursor pagination in Laravel:

```php
public function index(Request $request)
{
    $query = Order::where('user_id', auth()->id())
        ->orderBy('id', 'desc')
        ->limit(20);
    
    if ($cursor = $request->input('cursor')) {
        $query->where('id', '<', $cursor);
    }
    
    $orders = $query->get();
    
    return response()->json([
        'data' => $orders,
        'next_cursor' => $orders->last()?->id,
        'has_more' => $orders->count() === 20,
    ]);
}
```

### OR Conditions That Prevent Index Use

```php
// Bad: OR often prevents index use
Order::where('user_id', $userId)
    ->orWhere('merchant_id', $merchantId)
    ->get();
```

```php
// Good: UNION uses both indexes
$userOrders = Order::where('user_id', $userId);
$merchantOrders = Order::where('merchant_id', $merchantId);

$orders = $userOrders->union($merchantOrders)->get();
```

### Functions on Indexed Columns

```php
// Bad: Function on column prevents index use
Order::whereRaw('YEAR(created_at) = 2025')->get();
Order::whereRaw('LOWER(email) = ?', [strtolower($email)])->get();
```

```php
// Good: Rewrite to keep column bare
Order::whereBetween('created_at', ['2025-01-01', '2025-12-31'])->get();
```

### Batch Reads to Reduce Load

```php
// Bad: Query per iteration
public function processUsers(Collection $userIds)
{
    foreach ($userIds as $id) {
        $user = User::find($id);  // N queries
        $this->process($user);
    }
}

// Good: Single query, process in memory
public function processUsers(Collection $userIds)
{
    $users = User::whereIn('id', $userIds)->get()->keyBy('id');
    
    foreach ($userIds as $id) {
        $this->process($users[$id]);
    }
}
```

For large datasets, chunk to avoid memory issues:

```php
User::where('needs_processing', true)
    ->select(['id', 'email', 'data'])
    ->chunk(1000, function ($users) {
        foreach ($users as $user) {
            ProcessUser::dispatch($user->id);
        }
    });
```

### Count Queries at Scale

```php
// Bad: COUNT(*) on large tables is slow
$totalOrders = Order::where('user_id', $userId)->count();
// Scans all matching rows
```

```php
// Good: Maintain counters
Schema::table('users', function (Blueprint $table) {
    $table->unsignedInteger('orders_count')->default(0);
});

class Order extends Model
{
    protected static function booted()
    {
        static::created(function ($order) {
            $order->user->increment('orders_count');
        });
        
        static::deleted(function ($order) {
            $order->user->decrement('orders_count');
        });
    }
}

// Now it's instant
$totalOrders = $user->orders_count;
```

---

## Database Replication Setup

At scale, a single database server isn't enough. Read replicas distribute the read load while your primary handles all writes.

```
                    ┌─────────────┐
     Writes ───────►│   Primary   │
                    │  (MySQL)    │
                    └──────┬──────┘
                           │ replication
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Replica 1│ │ Replica 2│ │ Replica 3│
        └──────────┘ └──────────┘ └──────────┘
              ▲            ▲            ▲
              └────────────┴────────────┘
                    Reads distributed
```

### MySQL Primary Configuration

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_do_db = your_database
expire_logs_days = 7
binlog_format = ROW
sync_binlog = 1
innodb_flush_log_at_trx_commit = 1
master_info_repository = TABLE
relay_log_info_repository = TABLE
```

Create a replication user:

```sql
CREATE USER 'replicator'@'192.168.1.%' IDENTIFIED BY 'strong_password';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'192.168.1.%';
FLUSH PRIVILEGES;
```

Get the binary log position:

```sql
FLUSH TABLES WITH READ LOCK;
SHOW MASTER STATUS;
-- Note the File and Position values
-- Dump your database while locked
UNLOCK TABLES;
```

### MySQL Replica Configuration

```ini
[mysqld]
server-id = 2
relay_log = /var/log/mysql/mysql-relay-bin.log
read_only = 1
super_read_only = 1
replicate_do_db = your_database
master_info_repository = TABLE
relay_log_info_repository = TABLE
relay_log_recovery = ON
```

Configure replication:

```sql
CHANGE MASTER TO
    MASTER_HOST = '192.168.1.4',
    MASTER_USER = 'replicator',
    MASTER_PASSWORD = 'strong_password',
    MASTER_LOG_FILE = 'mysql-bin.000003',
    MASTER_LOG_POS = 73492;

START SLAVE;
SHOW SLAVE STATUS\G
```

Check these fields:
- `Slave_IO_Running: Yes`
- `Slave_SQL_Running: Yes`
- `Seconds_Behind_Master: 0`

### PostgreSQL Primary Configuration

Edit `postgresql.conf`:

```ini
wal_level = replica
max_wal_senders = 5
wal_keep_size = 1GB
max_replication_slots = 5
```

Edit `pg_hba.conf`:

```
host    replication     replicator      192.168.1.0/24          scram-sha-256
```

Create replication user and slot:

```sql
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'strong_password';
SELECT pg_create_physical_replication_slot('replica1_slot');
```

### PostgreSQL Replica Setup

```bash
# Clone from primary
sudo -u postgres pg_basebackup \
    -h 192.168.1.4 \
    -U replicator \
    -D /var/lib/postgresql/14/main \
    -P \
    --wal-method=stream \
    --slot=replica1_slot
```

Configure `postgresql.conf`:

```ini
hot_standby = on
primary_conninfo = 'host=192.168.1.4 port=5432 user=replicator password=strong_password'
primary_slot_name = 'replica1_slot'
```

### Laravel Read/Write Configuration

```php
// config/database.php
'mysql' => [
    'read' => [
        'host' => [
            '192.168.1.1',  // replica 1
            '192.168.1.2',  // replica 2
            '192.168.1.3',  // replica 3
        ],
    ],
    'write' => [
        'host' => [
            '192.168.1.4',  // primary
        ],
    ],
    'sticky' => true,
    'driver' => 'mysql',
    'database' => 'your_database',
    'username' => 'your_username',
    'password' => 'your_password',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
],
```

Laravel automatically routes SELECTs to replicas and writes to the primary.

### The Sticky Connection Problem

Replication has lag—usually milliseconds, but it's not instant:

```php
// User updates their profile
$user->update(['name' => 'New Name']);  // Goes to primary

// Immediately fetch and display
return User::find($user->id);  // Goes to replica... still has old name!
```

**Sticky connections fix this.** When `'sticky' => true`, Laravel remembers if the current request has done any writes. If it has, all subsequent reads in that same request go to the primary.

### Using ProxySQL for Connection Pooling

PHP's request lifecycle means constantly opening/closing connections. ProxySQL manages connection pools and handles query routing:

```sql
-- Add servers
INSERT INTO mysql_servers (hostgroup_id, hostname, port, weight) VALUES
    (10, '192.168.1.4', 3306, 1),   -- Primary (writes)
    (20, '192.168.1.1', 3306, 100), -- Replica 1 (reads)
    (20, '192.168.1.2', 3306, 100), -- Replica 2
    (20, '192.168.1.3', 3306, 100); -- Replica 3

-- Query routing rules
INSERT INTO mysql_query_rules (rule_id, active, match_pattern, destination_hostgroup) VALUES
    (1, 1, '^SELECT .* FOR UPDATE', 10),  -- SELECT FOR UPDATE → primary
    (2, 1, '^SELECT', 20),                 -- Other SELECTs → replicas
    (3, 1, '.*', 10);                      -- Everything else → primary

LOAD MYSQL SERVERS TO RUNTIME;
LOAD MYSQL QUERY RULES TO RUNTIME;
```

Laravel then connects to ProxySQL instead:

```php
'mysql' => [
    'host' => '127.0.0.1',
    'port' => 6033,  // ProxySQL port
    // ProxySQL handles read/write split
],
```

---

## Writing Queries That Work with Replication

Replication introduces constraints. Your queries need to account for lag and handle consistency tradeoffs.

### Design for Eventual Consistency

Most data doesn't need instant consistency:

```php
// Bad: Assumes instant consistency
public function updateProfile(Request $request)
{
    $user = auth()->user();
    $user->update($request->validated());
    
    // Redirects to page that reads from replica
    return redirect()->route('profile.show');
}

// Good: Pass the fresh data forward
public function updateProfile(Request $request)
{
    $user = auth()->user();
    $user->update($request->validated());
    
    return redirect()->route('profile.show')
        ->with('user', $user->fresh());
}
```

For APIs, return the updated resource:

```php
public function update(Request $request, Order $order)
{
    $order->update($request->validated());
    return response()->json([
        'message' => 'Updated',
        'data' => $order->fresh()->load('items', 'customer')
    ]);
}
```

### Identify Queries That Must Read from Primary

Some operations genuinely need the latest data:

```php
class WalletService
{
    // Financial operations: always read from primary
    public function withdraw(User $user, float $amount): Transaction
    {
        return DB::transaction(function () use ($user, $amount) {
            $wallet = Wallet::on('mysql::write')
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();
            
            if ($wallet->balance < $amount) {
                throw new InsufficientFundsException();
            }
            
            $wallet->decrement('balance', $amount);
            
            return Transaction::create([
                'wallet_id' => $wallet->id,
                'amount' => -$amount,
                'type' => 'withdrawal',
            ]);
        });
    }
    
    // Balance display: can tolerate staleness
    public function getDisplayBalance(User $user): float
    {
        return $user->wallet->balance;  // Reads from replica
    }
}
```

Create a trait for this pattern:

```php
trait ReplicaAware
{
    public static function fromPrimary()
    {
        return static::on(config('database.default') . '::write');
    }
    
    public static function fromReplica()
    {
        return static::on(config('database.default') . '::read');
    }
}

// Usage
$wallet = Wallet::fromPrimary()->find($id);
```

### Use Replicas for Heavy Analytical Queries

Reporting queries should never hit your primary:

```php
class ReportService
{
    protected $connection = 'mysql::read';
    
    public function getDailyStats(Carbon $date): array
    {
        return DB::connection($this->connection)
            ->table('orders')
            ->whereDate('created_at', $date)
            ->selectRaw('
                COUNT(*) as total_orders,
                SUM(amount) as total_revenue,
                AVG(amount) as average_order
            ')
            ->first();
    }
}
```

### Avoid Locks on Replicas

Pessimistic locking only works on the primary:

```php
// This will fail on a read-only replica
$product = Product::lockForUpdate()->find($id);

// Always explicit when locking
$product = Product::on('mysql::write')
    ->lockForUpdate()
    ->find($id);
```

---

## Caching at Every Layer

### Redis Isn't Optional—It's Infrastructure

At 100K req/s, you need aggressive caching:

```php
// Cache user sessions
'session' => [
    'driver' => 'redis',
],

// Cache application config
php artisan config:cache

// Cache routes
php artisan route:cache

// Cache views
php artisan view:cache
```

### Cache Invalidation Strategy

Design cache keys with invalidation in mind:

```php
class UserService
{
    public function getUser(int $id): User
    {
        return Cache::tags(['users', "user:{$id}"])
            ->remember("user:{$id}", 3600, function () use ($id) {
                return User::find($id);
            });
    }
    
    public function updateUser(User $user, array $data): User
    {
        $user->update($data);
        
        // Invalidate all caches for this user
        Cache::tags(["user:{$user->id}"])->flush();
        
        return $user;
    }
}
```

### HTTP Caching

Put Varnish or Cloudflare in front of your servers:

```php
// Add cache headers for cacheable responses
return response()->json($data)
    ->header('Cache-Control', 'public, max-age=60');
```

Even 30-second TTLs dramatically reduce origin load.

---

## Horizontal Scaling Patterns

### Stateless Application Servers

Your app servers must be stateless to scale horizontally:

- Sessions in Redis, not files
- File uploads to S3, not local disk
- No local state whatsoever

```php
// config/filesystems.php
'default' => 's3',

// config/session.php
'driver' => 'redis',

// config/cache.php
'default' => 'redis',
```

### Queue Everything That Can Wait

Emails, notifications, analytics, webhooks—none should block requests:

```php
// Bad: Blocks request
Mail::to($user)->send(new OrderConfirmation($order));

// Good: Queued
Mail::to($user)->queue(new OrderConfirmation($order));
```

At 100K req/s, you need dedicated queue workers:

```bash
# Multiple queue workers
php artisan queue:work --queue=high,default,low
```

### Database Writes Are Expensive

Buffer where possible:

```php
// Bad: Database write per event
Event::create(['type' => 'page_view', 'user_id' => $userId]);

// Good: Buffer in Redis, flush periodically
Redis::lpush('analytics:page_views', json_encode([
    'user_id' => $userId,
    'timestamp' => now(),
]));

// Scheduled job flushes to database
class FlushAnalytics extends Command
{
    public function handle()
    {
        $events = [];
        while ($event = Redis::lpop('analytics:page_views')) {
            $events[] = json_decode($event, true);
        }
        
        if ($events) {
            Event::insert($events);  // Single bulk insert
        }
    }
}
```

---

## PHP and Laravel Specific Optimizations

### OPcache Configuration

Properly tuned OPcache can 2-3x your throughput:

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=64
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0  # Disable in production
opcache.save_comments=1
opcache.fast_shutdown=1
```

### Laravel Octane

Octane keeps your app in memory between requests, eliminating bootstrap cost:

```bash
composer require laravel/octane
php artisan octane:install
php artisan octane:start --server=swoole --workers=4
```

**Caution:** You can't rely on PHP's "fresh state per request" anymore. Watch for:
- Memory leaks
- Static variable contamination
- Request isolation issues

### Prevent Lazy Loading

Catch N+1 issues in development:

```php
// AppServiceProvider.php
public function boot()
{
    Model::preventLazyLoading(!app()->isProduction());
}
```

---

## Architecture Decisions for Scale

### CQRS for High-Traffic Features

Separate read and write models:

```php
// Write model - full validation, normalized
class Order extends Model
{
    public function place(array $data): void
    {
        // Complex business logic
        // Writes to normalized tables
    }
}

// Read model - denormalized for fast queries
class OrderReadModel extends Model
{
    protected $table = 'order_read_models';
    
    // Pre-joined, pre-calculated data
    // No relationships needed
}
```

### Circuit Breakers for External Services

One slow API shouldn't cascade into site-wide failure:

```php
class PaymentService
{
    public function charge(User $user, float $amount): Transaction
    {
        return $this->circuitBreaker->call(function () use ($user, $amount) {
            return $this->gateway->charge($user, $amount);
        }, function () {
            throw new PaymentUnavailableException();
        });
    }
}
```

### Rate Limiting and Backpressure

Shed load gracefully when overwhelmed:

```php
// routes/api.php
Route::middleware('throttle:1000,1')->group(function () {
    // 1000 requests per minute
});
```

At infrastructure level, configure your load balancer to queue or reject excess requests rather than letting everything slow down.

---

## Monitoring and Profiling

### Laravel Query Log

```php
DB::enableQueryLog();
// Run your code
dd(DB::getQueryLog());
```

### Slow Query Logging

```php
// AppServiceProvider.php
DB::listen(function ($query) {
    if ($query->time > 100) {
        Log::warning('Slow query', [
            'sql' => $query->sql,
            'time' => $query->time,
        ]);
    }
});
```

### Database-Level Slow Query Log

```ini
# MySQL
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 1
log_queries_not_using_indexes = 1
```

Then analyze:

```bash
mysqldumpslow -s t /var/log/mysql/slow.log
```

### Replication Lag Monitoring

```php
class CheckReplicationLag extends Command
{
    public function handle()
    {
        $lag = DB::connection('mysql_replica')
            ->selectOne("SHOW SLAVE STATUS")
            ->Seconds_Behind_Master;
        
        if ($lag > 5) {
            Log::critical("Replication lag: {$lag} seconds");
        }
    }
}
```

---

## Quick Optimization Checklist

Before deploying any query to production at scale:

1. **Run EXPLAIN ANALYZE.** No full table scans unless table is tiny.
2. **Check index usage.** Is the query using the index you expect?
3. **Limit selected columns.** No `SELECT *` in hot paths.
4. **Check N+1s.** Use `preventLazyLoading()` in development.
5. **Pagination method.** Cursor-based for deep pagination.
6. **Aggregates.** Pre-compute if queried frequently.
7. **Data volume.** What happens when this table has 10x the rows?

---

## Priority Order for Optimization

When rebuilding a system for scale, focus on these areas in order:

1. **Database optimization and read replicas** — The biggest bottleneck
2. **Redis caching layer** — Reduce database load dramatically
3. **Queue offloading** — Remove slow operations from request path
4. **Horizontal scaling of app servers** — Handle more concurrent requests

But before any of that: **instrument the existing system.** You need to know where time is actually spent. APM tools will show you that 80% of your latency probably comes from 3-4 specific queries or operations.

---

## Final Thoughts

Scaling to 100K requests per second isn't about any single technique—it's about understanding where your bottlenecks are and systematically eliminating them. Start with the database because that's almost always the first thing to fail. Add caching aggressively. Queue everything that doesn't need immediate response. And always measure before and after.

The patterns in this guide have been battle-tested at scale. They're not theoretical—they're what actually works when millions of users are hitting your application simultaneously.

Good luck with your rebuild.
