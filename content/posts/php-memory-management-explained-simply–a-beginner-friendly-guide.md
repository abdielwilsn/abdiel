---
id: 6d83f9e2-6e93-42f7-be97-6ec8ed29f8c6
title: PHP Memory Management Explained Simply – A Beginner-Friendly Guide (2025 Edition)
date: Wed Dec 31 2025
duration: 5 min
categories: 
---

You’ve probably seen this scary error at least once:

```
Fatal error: Allowed memory size of 134217728 bytes exhausted
```

In plain English: “Your PHP script used too much memory and crashed.”

This article will explain how PHP handles memory, why it runs out so easily, and — most importantly — how to fix it forever using simple, modern techniques.

### 1. How PHP Uses Memory (The Simple Explanation)

Every variable in PHP ($name, $users, $fileContent, etc.) takes up space in RAM.  
PHP is actually very efficient most of the time — it shares memory between variables until one of them changes (this is called copy-on-write).

But when you do something big — like loading 100,000 database records or reading a large file — PHP can suddenly eat hundreds of megabytes in seconds.

### 2. The Most Common Memory Mistakes (And How to Spot Them)

#### Mistake 1: Loading All Database Records at Once
```php
$users = User::all(); // Loads EVERY user into memory
foreach ($users as $user) {
    // send email
}
```
If you have 100,000 users, this can easily use 300–600 MB of RAM → crash!

#### Mistake 2: Reading Large Files Completely
```php
$content = file_get_contents('customers-200mb.csv'); 
// A 200 MB file can become 800+ MB in memory!
```

#### Mistake 3: Storing Too Much Data in Arrays
```php
$cache = [];
for ($i = 0; $i < 500000; $i++) {
    $cache[] = generateBigReport($i); // Memory keeps growing
}
```

### 3. The Right Way: Modern Solutions That Actually Work

#### Solution 1: Use Generators (Your New Best Friend)

A generator is like a conveyor belt — it gives you one item at a time instead of dumping everything at once.

```php
// Laravel example – stays under 20 MB even with millions of records
foreach (User::cursor() as $user) {
    Mail::to($user)->send(new WelcomeMail());
    // Only ONE user in memory at a time!
}

// Plain PHP version for CSV files
function readLargeCsv(string $path): Generator
{
    $handle = fopen($path, 'r');
    while (($row = fgetcsv($handle)) !== false) {
        yield $row; // One row at a time
    }
    fclose($handle);
}

// Use it
foreach (readLargeCsv('huge-file.csv') as $row) {
    // Process one row → memory stays tiny
}
```

#### Solution 2: Process Files in Small Chunks
```php
$handle = fopen('big-log.txt', 'r');
while (!feof($handle)) {
    $chunk = fread($handle, 8192); // Read only 8KB at a time
    // Process $chunk
    unset($chunk); // Free memory immediately
}
fclose($handle);
```

#### Solution 3: Use Redis Instead of PHP Arrays for Big Data
```php
// Wrong – eats server RAM
$bigCache = [];

// Correct – stored outside PHP
Cache::put('daily-report', $data, now()->addHours(24));
```

### 4. How to Check Memory Usage in Your Code

Add these lines anywhere to see what’s happening:

```php
echo "Current memory: " . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";
echo "Peak memory: "    . round(memory_get_peak_usage() / 1024 / 1024, 2) . " MB\n";
```

### 5. Golden Rules Every PHP Developer Should Follow

1. Never use Model::all() for bulk operations → use cursor() or lazy()
2. Never use file_get_contents() on large files → use fopen() + chunks
3. Never cache large datasets in PHP arrays → use Redis or database
4. Always unset large variables when done
5. Run gc_collect_cycles() after heavy operations
6. Test with real-sized data (not just 10 records!)

### Real Example: Import 1 Million Rows Safely

```php
function importUsers(string $csvFile): void
{
    $i = 0;
    foreach (readLargeCsv($csvFile) as $row) {
        User::create([
            'name'  => $row[0],
            'email' => $row[1],
            'phone' => $row[2],
        ]);

        if (++$i % 10000 === 0) {
            echo "Processed $i users | Memory: " . 
                 round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";
        }
    }
}
```

This script can run for hours and never use more than ~20 MB of RAM.

### Final Thoughts

PHP itself is not a memory hog — bad code is.

Once you start using generators and chunking, memory errors become a thing of the past. Your applications will handle millions of records smoothly, your server will stay happy, and you’ll sleep better at night.

Start applying these patterns today. Your future self (and your hosting provider) will thank you.
