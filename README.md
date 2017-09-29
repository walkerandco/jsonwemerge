# JSON Weak Entity Merge

This is a node script which is designed to take a JSON data structure (primary database) formatted as a JSON array and compare with it a value which has a weak entity relationship to a value in a second comparator database. For example, the primary database may contain a transaction ID, with the comparator table containing a matching transaction ID and a further description of the transaction. This tool merges the weak entity so that instead of the primary database containing a transaction ID, it contains the description.

The tool takes any JSON path for comparison and writes a new primary database as a separate JSON file.

**Requires: Node.js 4.0+**


# Usage


```
Example
>node jsonwemerge -d dump.json -n naics.json -o testdump.json -s 'victim.industry' -c 'Code' -v 'Title'

JSON Weak Entity Merge: [options]
  --database FILE, -d FILE               The database file against which values will be merged.
  --definition FILE, -n FILE             The comparator database file containing the weak entity.
  --out FILE, -o FILE                    The output file.
  --src JSON PATH, -s JSON PATH          The weak entity to be replaced.
  --comparator JSON PATH, -c JSON PATH   The weak entity within the comparator.
  --value JSON PATH, -v JSON PATH        The value key to be inserted via the weak entity.
  --help, -h                             Command line help.
```

*Copyright (c) Steven Walker-Roberts 2017*
